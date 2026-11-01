"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const TEXTURES = [
  "/media/textures/hero-couple.jpg",
  "/media/textures/hero-bride.jpg",
  "/media/textures/hero-microphone.jpg",
  "/media/textures/hero-children.jpg",
  "/media/textures/hero-jcin.jpg",
  "/media/textures/hero-eid-men.jpg",
] as const;

type Placement = {
  texture: number;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  phase: number;
  float: number;
};

const DESKTOP_PLACEMENTS: Placement[] = [
  { texture: 0, position: [0.58, 0.18, 0], rotation: [0, -0.06, 0.01], width: 2.5, phase: 0, float: 0.02 },
  { texture: 1, position: [-1.62, 0.82, -0.62], rotation: [0, 0.22, -0.025], width: 1.13, phase: 1.7, float: 0.028 },
  { texture: 2, position: [-1.66, -1.04, 0.56], rotation: [0.02, 0.16, 0.02], width: 0.92, phase: 3.1, float: 0.024 },
  { texture: 3, position: [1.52, -1.18, 0.62], rotation: [-0.02, -0.16, -0.02], width: 1.48, phase: 4.5, float: 0.03 },
  { texture: 4, position: [2.18, 0.86, -1.28], rotation: [0, -0.3, 0.02], width: 1.08, phase: 2.4, float: 0.022 },
  { texture: 5, position: [0.42, 1.52, -1.85], rotation: [0.02, -0.02, 0], width: 1.22, phase: 5.4, float: 0.02 },
];

const MOBILE_PLACEMENTS: Placement[] = [
  { texture: 0, position: [0.42, 0.42, 0], rotation: [0, -0.06, 0.01], width: 1.9, phase: 0, float: 0.018 },
  { texture: 1, position: [-0.92, 1.02, -0.5], rotation: [0, 0.2, -0.02], width: 0.84, phase: 1.7, float: 0.022 },
  { texture: 3, position: [0.9, -0.78, 0.35], rotation: [0, -0.15, -0.02], width: 1.05, phase: 4.1, float: 0.02 },
  { texture: 2, position: [-0.86, -0.82, 0.42], rotation: [0, 0.15, 0.02], width: 0.68, phase: 2.8, float: 0.018 },
];

function Print({ placement, texture }: { placement: Placement; texture: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  const ratio = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    if (!image?.width || !image?.height) return 1;
    return image.width / image.height;
  }, [texture]);

  const height = placement.width / ratio;
  const framePadding = 0.045;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y =
      placement.position[1] + Math.sin(t * 0.32 + placement.phase) * placement.float;
    group.current.position.x =
      placement.position[0] + Math.cos(t * 0.24 + placement.phase) * placement.float * 0.45;
    group.current.rotation.z =
      placement.rotation[2] + Math.sin(t * 0.22 + placement.phase) * 0.003;
  });

  return (
    <group
      ref={group}
      position={placement.position}
      rotation={placement.rotation}
    >
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[placement.width + framePadding * 2, height + framePadding * 2]} />
        <meshBasicMaterial color="#e7e0d2" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[placement.width + framePadding * 2 + 0.06, height + framePadding * 2 + 0.06]} />
        <meshBasicMaterial color="#090908" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[placement.width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Wall({
  compact,
  onReady,
}: {
  compact: boolean;
  onReady: () => void;
}) {
  const textures = useTexture(TEXTURES as unknown as string[]);
  const group = useRef<THREE.Group>(null);
  const { pointer, camera } = useThree();
  const scrollProgress = useRef(0);

  useEffect(() => {
    const update = () => { scrollProgress.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight)); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const list = Array.isArray(textures) ? textures : [textures];
    for (const texture of list as THREE.Texture[]) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    }
    onReady();
  }, [textures, onReady]);

  useFrame(() => {
    if (!group.current) return;
    const targetY = pointer.x * (compact ? 0.04 : 0.075);
    const targetX = -pointer.y * (compact ? 0.025 : 0.04);
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.045;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.045;
    camera.position.x += (pointer.x * 0.11 - camera.position.x) * 0.03;
    camera.position.y += (-pointer.y * 0.06 - camera.position.y) * 0.03;
    // The opening gently moves into the archive as the visitor begins the story.
    const targetZ = (compact ? 7.3 : 7.1) - scrollProgress.current * 0.7;
    camera.position.z += (targetZ - camera.position.z) * 0.035;
    camera.lookAt(0, 0, 0);
  });

  const placements = compact ? MOBILE_PLACEMENTS : DESKTOP_PLACEMENTS;
  const textureList = textures as THREE.Texture[];

  return (
    <group ref={group} position={compact ? [0, 0.45, 0] : [0, 0, 0]} scale={compact ? 1.06 : 1}>
      {placements.map((placement) => (
        <Print
          key={placement.texture}
          placement={placement}
          texture={textureList[placement.texture]}
        />
      ))}
    </group>
  );
}

export default function HeroScene({
  compact = false,
  active = true,
  onReady,
}: {
  compact?: boolean;
  active?: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, compact ? 7.3 : 7.1], fov: compact ? 42 : 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Wall compact={compact} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
