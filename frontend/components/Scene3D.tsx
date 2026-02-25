import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const FountainPenNib = () => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005;
            groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
        }
    });

    return (
        <group ref={groupRef} rotation={[0.4, 0, 0]}>
            {/* Pen Body (Lower part) */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 2, 32]} />
                <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Gold Ring */}
            <mesh position={[0, -0.1, 0]}>
                <torusGeometry args={[0.35, 0.05, 16, 100]} />
                <meshStandardMaterial color="#C5A059" metalness={1} roughness={0.1} />
            </mesh>

            {/* Nib (Stylized) */}
            <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.3, 1.2, 4]} />
                <meshStandardMaterial color="#C5A059" metalness={1} roughness={0.05} />
            </mesh>

            {/* Ink Glow */}
            <pointLight position={[0, 1.5, 0]} intensity={2} color="#C5A059" distance={3} />
        </group>
    );
};

const AbstractKnowledgeField = () => {
    const count = 50;
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100;
            const factor = Math.random() * 100 + 20;
            const speed = Math.random() * 0.01 + 0.01;
            const x = Math.random() * 6 - 3;
            const y = Math.random() * 6 - 3;
            const z = Math.random() * 6 - 3;

            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, []);

    const dummy = new THREE.Object3D();
    const meshRef = useRef<THREE.InstancedMesh>(null!);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { time, factor, speed, x, y, z } = particle;
            time = particle.time += speed / 2;
            const a = Math.cos(time) * 2;
            const b = Math.sin(time) * 2;
            dummy.position.set(
                x + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 100,
                y + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 100,
                z + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 100
            );
            dummy.scale.set(0.05, 0.05, 0.05);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#C5A059" metalness={0.5} roughness={0.1} transparent opacity={0.4} />
        </instancedMesh>
    );
};

const Scene3D: React.FC = () => {
    return (
        <div className="w-full h-full min-h-[500px]">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#C5A059" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <FountainPenNib />
                </Float>

                <AbstractKnowledgeField />

                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Scene3D;
