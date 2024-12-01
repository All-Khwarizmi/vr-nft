// packages/nextjs/hooks/useFirstPersonControls.ts
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export const useFirstPersonControls = () => {
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const rotation = useRef({ x: 0, y: 0 });
  const position = useRef(new Vector3(0, 1.7, 5)); // Hauteur des yeux ~1.7m
  const speed = 0.15;

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

    const handleMouseMove = (e: MouseEvent) => {
      rotation.current.x -= e.movementY * 0.002;
      rotation.current.y -= e.movementX * 0.002;

      // Limiter le regard vertical
      rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    // Calculer la direction du mouvement
    const direction = new Vector3();
    const rotation90 = rotation.current.y + Math.PI / 2;

    if (moveState.current.forward) {
      direction.x -= Math.sin(rotation.current.y) * speed;
      direction.z -= Math.cos(rotation.current.y) * speed;
    }
    if (moveState.current.backward) {
      direction.x += Math.sin(rotation.current.y) * speed;
      direction.z += Math.cos(rotation.current.y) * speed;
    }
    if (moveState.current.left) {
      direction.x -= Math.sin(rotation90) * speed;
      direction.z -= Math.cos(rotation90) * speed;
    }
    if (moveState.current.right) {
      direction.x += Math.sin(rotation90) * speed;
      direction.z += Math.cos(rotation90) * speed;
    }

    position.current.add(direction);
  });

  return {
    position: position.current,
    rotation: rotation.current,
  };
};
