// components/LanyardCard.tsx
// Physics-based lanyard card — drag to interact
"use client";

import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

// ── Type helpers for meshline JSX ───────────────────────────────────────────
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

function Band() {
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<any>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<any>(null!);
  const card = useRef<any>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const { width, height } = useThree((state) => state.size);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
      (band.current.geometry as any).setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} angularDamping={2} linearDamping={2} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          angularDamping={2}
          linearDamping={2}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          {/* Card face */}
          <mesh
            onPointerUp={(e) => {
              (e.target as Element & { releasePointerCapture: (id: number) => void }).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element & { setPointerCapture: (id: number) => void }).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <planeGeometry args={[0.8 * 2, 1.125 * 2]} />
            {/* Glass card material */}
            <meshPhysicalMaterial
              transparent
              opacity={0.18}
              color="#a8d8ff"
              roughness={0}
              metalness={0.1}
              envMapIntensity={1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Card border glow */}
          <mesh position={[0, 0, -0.005]}>
            <planeGeometry args={[0.8 * 2 + 0.04, 1.125 * 2 + 0.04]} />
            <meshBasicMaterial
              transparent
              opacity={0.25}
              color="#7eb8ff"
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Drag hint label rendered as a sprite-like plane */}
          <mesh position={[0, -0.6, 0.012]}>
            <planeGeometry args={[0.8, 0.12]} />
            <meshBasicMaterial transparent opacity={0} color="white" />
          </mesh>
        </RigidBody>
      </group>

      {/* Lanyard rope */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          transparent
          opacity={0.6}
          color="#c4b5fd"
          depthTest={false}
          resolution={[width, height]}
          lineWidth={1.2}
        />
      </mesh>
    </>
  );
}

export default function LanyardCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
      }}
    >
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        {/* Ambient and point lights for glass material */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#c4b5fd" />
        <pointLight position={[-10, -5, -10]} intensity={0.4} color="#7eb8ff" />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
      </Canvas>
    </div>
  );
}
