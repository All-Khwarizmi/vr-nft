// packages/nextjs/app/gallery3d/page.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { PointerLockControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

// packages/nextjs/app/gallery3d/page.tsx

// packages/nextjs/app/gallery3d/page.tsx

// packages/nextjs/app/gallery3d/page.tsx

// packages/nextjs/app/gallery3d/page.tsx

function Movement() {
  const { camera } = useThree();
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const speed = 0.15;
  const direction = useRef(new Vector3());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = false;
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    direction.current.set(0, 0, 0);

    if (moveState.current.forward) {
      direction.current.z = -1;
    }
    if (moveState.current.backward) {
      direction.current.z = 1;
    }
    if (moveState.current.left) {
      direction.current.x = -1;
    }
    if (moveState.current.right) {
      direction.current.x = 1;
    }

    // Normaliser et appliquer la vitesse
    if (direction.current.length() > 0) {
      direction.current.normalize().multiplyScalar(speed);

      // On applique la rotation de la caméra au mouvement
      const cameraDirection = camera.getWorldDirection(new Vector3());
      const angle = Math.atan2(cameraDirection.x, cameraDirection.z);

      const moveX = direction.current.x * Math.cos(angle) - direction.current.z * Math.sin(angle);
      const moveZ = direction.current.x * Math.sin(angle) + direction.current.z * Math.cos(angle);

      camera.position.x += moveX;
      camera.position.z += moveZ;
    }
  });

  return null;
}

function GalleryRoom() {
  return (
    <group>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* Mur arrière */}
      <mesh position={[0, 5, -10]}>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Mur gauche */}
      <mesh position={[-10, 5, 0]}>
        <boxGeometry args={[0.5, 10, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Mur droit */}
      <mesh position={[10, 5, 0]}>
        <boxGeometry args={[0.5, 10, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Plafond */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[20, 0.5, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Points d'éclairage */}
      <pointLight position={[-5, 8, 0]} intensity={0.5} />
      <pointLight position={[5, 8, 0]} intensity={0.5} />
      <pointLight position={[0, 8, -5]} intensity={0.5} />
      <ambientLight intensity={0.2} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <GalleryRoom />
      <PointerLockControls />
      <Movement />
    </>
  );
}

export default function Gallery3DPage() {
  return (
    <>
      <div className="absolute z-10 p-4 text-white">
        Cliquez pour commencer
        <br />
        Utilisez WASD/Flèches pour vous déplacer
        <br />
        ESC pour sortir
      </div>
      <div className="flex w-full h-screen">
        <Canvas camera={{ position: [0, 1.7, 5] }}>
          <Scene />
        </Canvas>
      </div>
    </>
  );
}
