import { useEffect } from "react";
import { useRef } from "react";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
function MeshComponent({ fileUrl }) {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.z = 90; 
    }, [camera]);
    const mesh = useRef<Mesh>(null);
    const gltf = useLoader(GLTFLoader, fileUrl);
    const myRef = useRef(null);
    myRef.current = mesh;
    useFrame(() => {
     
        if (myRef.current) {
          myRef.current.rotation.y += 0.01;
        }
      
    });
    return (
      <mesh ref={myRef}>
        <primitive object={gltf.scene} />
        
      </mesh>
    );
  }
  export default MeshComponent;