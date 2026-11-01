"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCursor, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { SpatialProject } from "@/content/projects";

type Placement = {
  x: number;
  y: number;
  z: number;
  base: number;
  tilt: number;
};

const DESKTOP: Placement[] = [
  { x: -3.25, y: 0.42, z: -1.0, base: 1.16, tilt: 0.22 },
  { x: -2.35, y: -0.46, z: -0.28, base: 1.27, tilt: 0.16 },
  { x: -1.36, y: 0.62, z: 0.18, base: 1.02, tilt: 0.09 },
  { x: -0.42, y: -0.16, z: -0.66, base: 1.33, tilt: 0.04 },
  { x: 0.58, y: 0.4, z: 0.1, base: 1.16, tilt: -0.04 },
  { x: 1.52, y: -0.52, z: -0.5, base: 1.26, tilt: -0.12 },
  { x: 2.4, y: 0.6, z: 0.12, base: 1.02, tilt: -0.18 },
  { x: 3.26, y: -0.34, z: -0.9, base: 1.16, tilt: -0.26 },
  { x: 1.0, y: 1.7, z: -1.9, base: 0.9, tilt: 0.02 },
];

const MOBILE: Placement[] = [
  { x: -1.65, y: 0.72, z: -0.5, base: 0.98, tilt: 0.14 },
  { x: 0.15, y: 0.1, z: 0, base: 1.28, tilt: 0.02 },
  { x: 1.6, y: 0.78, z: -0.6, base: 0.92, tilt: -0.14 },
  { x: -1.2, y: -1.06, z: -0.1, base: 0.95, tilt: 0.1 },
  { x: 1.4, y: -1.0, z: -0.2, base: 1.0, tilt: -0.1 },
];

function ArchivePrint({
  placement,
  project,
  texture,
  isActive,
  isSelected,
  onHover,
  onOpen,
}: {
  placement: Placement;
  project: SpatialProject;
  texture: THREE.Texture;
  isActive: boolean;
  isSelected: boolean;
  onHover: (slug: string | null) => void;
  onOpen: (slug: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  useCursor(hovered && !pressed);

  const ratio = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    if (!image?.width || !image?.height) return 1;
    return image.width / image.height;
  }, [texture]);

  const naturalHeight = placement.base / ratio;
  const fit = Math.min(1, 2.25 / naturalHeight);
  const width = placement.base * fit;
  const height = naturalHeight * fit;
  const pad = 0.05;

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const floatX = Math.sin(t * 0.26 + placement.x) * 0.012;
    const floatY = Math.cos(t * 0.22 + placement.x) * 0.014;
    const targetX = placement.x + floatX;
    const targetY = placement.y + floatY + (isActive ? 0.045 : 0);
    const targetZ = placement.z + (isActive ? 0.16 : 0) + (isSelected ? 2.2 : 0);
    const targetScale = isSelected ? 1.28 : isActive ? 1.035 : 1;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 4, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 4, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 4, delta);
    const next = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5, delta);
    group.current.scale.setScalar(next);
  });

  const handleEnter = () => {
    setHovered(true);
    onHover(project.slug);
  };
  const handleLeave = () => {
    setHovered(false);
    onHover(null);
  };
  const handleClick = () => {
    setPressed(true);
    onOpen(project.slug);
  };

  return (
    <group
      ref={group}
      position={[placement.x, placement.y, placement.z]}
      rotation={[0, -placement.x * 0.075, placement.tilt * 0.08]}
      onPointerOver={(event) => {
        event.stopPropagation();
        handleEnter();
      }}
      onPointerOut={handleLeave}
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width + pad * 2 + 0.07, height + pad * 2 + 0.07]} />
        <meshBasicMaterial color="#080807" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width + pad * 2, height + pad * 2]} />
        <meshBasicMaterial
          color={isActive ? "#c57b4e" : "#e7e0d2"}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene({
  projects,
  compact,
  onReady,
  onActiveChange,
  onOpen,
}: {
  projects: SpatialProject[];
  compact: boolean;
  onReady: () => void;
  onActiveChange: (project: SpatialProject | null) => void;
  onOpen: (slug: string) => void;
}) {
  const textures = useTexture(projects.map((project) => project.texture)) as THREE.Texture[];
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const placements = compact ? MOBILE : DESKTOP;
  const shown = compact ? projects.slice(0, MOBILE.length) : projects.slice(0, DESKTOP.length);

  useEffect(() => {
    for (const texture of textures) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    }
    onReady();
  }, [textures, onReady]);

  useEffect(() => {
    const active = shown.find((project) => project.slug === activeSlug) ?? null;
    onActiveChange(active);
  }, [activeSlug, shown, onActiveChange]);

  useEffect(() => {
    if (!selectedSlug) return;
    const timeout = window.setTimeout(() => onOpen(selectedSlug), 520);
    return () => window.clearTimeout(timeout);
  }, [selectedSlug, onOpen]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const drift = Math.sin(state.clock.elapsedTime * 0.16) * 0.01;
    const targetY = pointer.x * (compact ? 0.035 : 0.06) + drift;
    const targetX = -pointer.y * (compact ? 0.02 : 0.035);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
  });

  return (
    <group ref={group}>
      {shown.map((project, index) => (
        <ArchivePrint
          key={project.slug}
          placement={placements[index]}
          project={project}
          texture={textures[index]}
          isActive={activeSlug === project.slug}
          isSelected={selectedSlug === project.slug}
          onHover={(slug) => setActiveSlug(slug)}
          onOpen={(slug) => {
            setActiveSlug(slug);
            setSelectedSlug(slug);
          }}
        />
      ))}
    </group>
  );
}

export default function SpatialArchiveScene({
  projects,
  compact = false,
  active = true,
  onReady,
  onActiveChange,
  onOpen,
}: {
  projects: SpatialProject[];
  compact?: boolean;
  active?: boolean;
  onReady: () => void;
  onActiveChange: (project: SpatialProject | null) => void;
  onOpen: (slug: string) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.1, compact ? 8.6 : 7.4], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#111110", 8, 15]} />
      <Suspense fallback={null}>
        <Scene
          projects={projects}
          compact={compact}
          onReady={onReady}
          onActiveChange={onActiveChange}
          onOpen={onOpen}
        />
      </Suspense>
    </Canvas>
  );
}
