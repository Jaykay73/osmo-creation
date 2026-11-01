"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCursor, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitionWork } from "@/content/exhibition";

export type OrbitState = {
  rotation: number;
};

function Frame({
  work,
  texture,
  angle,
  radius,
  compact,
  onOpen,
  controls,
}: {
  work: ExhibitionWork;
  texture: THREE.Texture;
  angle: number;
  radius: number;
  compact: boolean;
  onOpen: () => void;
  controls: MutableRefObject<OrbitState>;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const ratio = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    if (!image?.width || !image?.height) return 1;
    return image.width / image.height;
  }, [texture]);

  const width = compact ? 1.34 : 1.55;
  const naturalHeight = width / ratio;
  const fit = Math.min(1, (compact ? 2.0 : 2.35) / naturalHeight);
  const finalWidth = width * fit;
  const finalHeight = naturalHeight * fit;
  const pad = 0.055;

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y =
      0.18 + Math.sin(t * 0.2 + angle * 5) * 0.012 + (hovered ? 0.035 : 0);
    const target = hovered ? 1.025 : 1;
    const next = THREE.MathUtils.damp(group.current.scale.x, target, 5, delta);
    group.current.scale.setScalar(next);
    // gently face the viewer inside the room, while the parent group orbits
    const baseRotation = -angle;
    group.current.rotation.y =
      baseRotation + Math.sin(t * 0.18 + angle * 4) * 0.008 + (hovered ? 0.02 : 0);
  });

  return (
    <group
      ref={group}
      position={[Math.sin(angle) * radius, 0.18, -Math.cos(angle) * radius]}
      rotation={[0, -angle, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation();
        if (controls.current.rotation !== controls.current.rotation) return;
        onOpen();
      }}
    >
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[finalWidth + pad * 2 + 0.08, finalHeight + pad * 2 + 0.08]} />
        <meshBasicMaterial color="#070706" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[finalWidth + pad * 2, finalHeight + pad * 2]} />
        <meshBasicMaterial
          color={hovered ? "#c57b4e" : "#e7e0d2"}
          toneMapped={false}
          opacity={1}
          transparent
        />
      </mesh>
      <mesh>
        <planeGeometry args={[finalWidth, finalHeight]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Room({
  works,
  compact,
  controls,
  onReady,
  onOpen,
  showAll,
}: {
  works: ExhibitionWork[];
  compact: boolean;
  controls: MutableRefObject<OrbitState>;
  onReady: () => void;
  onOpen: (index: number) => void;
  showAll: boolean;
}) {
  const textures = useTexture(works.map((work) => work.texture)) as THREE.Texture[];
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const shown = compact && !showAll ? works.slice(0, 6) : works;
  const spread = compact ? Math.PI * 0.75 : Math.PI * 0.92;
  const radius = compact ? 4.2 : 5.2;

  useEffect(() => {
    for (const texture of textures) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    }
    onReady();
  }, [textures, onReady]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const drift = Math.sin(state.clock.elapsedTime * 0.11) * 0.008;
    const target = controls.current.rotation + pointer.x * 0.035 + drift;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 4, delta);
  });

  return (
    <group ref={group}>
      {shown.map((work, index) => {
        const angle = -spread / 2 + (index / Math.max(shown.length - 1, 1)) * spread;
        // A little radial variation so the prints hang at different depths
        // instead of reading as a single flat arc.
        const depth = ((index % 3) - 1) * (compact ? 0.22 : 0.32);
        return (
          <Frame
            key={work.id}
            work={work}
            texture={textures[index]}
            angle={angle}
            radius={radius + depth}
            compact={compact}
            controls={controls}
            onOpen={() => onOpen(index)}
          />
        );
      })}
    </group>
  );
}

export default function ExhibitionScene({
  works,
  compact = false,
  active = true,
  controls,
  onReady,
  onOpen,
  showAll = false,
}: {
  works: ExhibitionWork[];
  compact?: boolean;
  active?: boolean;
  controls: MutableRefObject<OrbitState>;
  onReady: () => void;
  onOpen: (index: number) => void;
  showAll?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{
        position: [0, 0.05, 0],
        // Explicit rotation stops R3F from calling lookAt(0,0,0), which would
        // point this origin-mounted camera straight down into the floor.
        rotation: [0, 0, 0],
        fov: compact ? 65 : 58,
        near: 0.1,
        far: 30,
      }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#0b0b0a", 3.4, 9]} />
      <Suspense fallback={null}>
        <Room
          showAll={showAll}
          works={works}
          compact={compact}
          controls={controls}
          onReady={onReady}
          onOpen={onOpen}
        />
      </Suspense>
    </Canvas>
  );
}
