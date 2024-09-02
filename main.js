// three js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import gsap from "gsap";
import Lenis from "lenis";
import SplitType from "split-type";

const hero = document.querySelector(".hero");

function initLenis() {
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function initThree() {
  const loadingManager = new THREE.LoadingManager();
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  hero.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(animate);

  // Lights
  const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // soft white light
  directionalLight.position.y = 3;
  directionalLight.position.x = 6;
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 10); // soft white light
  directionalLight2.position.y = 3;
  directionalLight2.position.x = -6;
  scene.add(directionalLight2);

  const directionalLight3 = new THREE.DirectionalLight("red", 2);
  directionalLight3.position.y = 20;
  directionalLight3.position.x = 50;
  scene.add(directionalLight3);

  const directionalLight4 = new THREE.DirectionalLight("yellow", 2);
  directionalLight4.position.y = 20;
  directionalLight4.position.x = -50;
  scene.add(directionalLight4);

  // Remove loader when done
  loadingManager.onLoad = function () {
    checkIfLoaded();
  };

  // Handle load error
  loadingManager.onError = function (url) {
    console.log("There was an error loading " + url);
  };

  // Use the loading manager with GLTFLoader
  const loader = new GLTFLoader(loadingManager);
  const dracoLoader = new DRACOLoader();

  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
  );
  dracoLoader.setDecoderConfig({ type: "js" });

  loader.setDRACOLoader(dracoLoader);

  // Load a GLB model
  let model;
  loader.load("/watch.glb", function (glb) {
    model = glb.scene;
    model.position.set(8, 2, 0);
    model.rotateX(0.25);
    gsap.to(model.rotation, {
      y: 360,
      repeat: -1,
      duration: 2580,
    });
    // Access specific materials by their name and set properties
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.6;
        child.material.roughness = 0.3;
      }
    });
    scene.add(model);
  });

  function animate() {
    renderer.render(scene, camera);
  }
  camera.position.z = 11;

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.innerWidth, canvas.innerHeight);
  });
}

function showHeroImgOnSmallDevices() {
  const img = document.createElement("img");
  img.setAttribute("src", "./hero-img.avif");
  img.setAttribute("class", "hero-img");
  img.style.width = "400px";
  img.style.height = "80%";
  img.style.objectFit = "cover";
  hero.appendChild(img);
}

function isLargeScreen() {
  return window.innerWidth > 926;
}

function animateWithGsap() {
  const heroHeading = new SplitType(".hero-heading");
  gsap.from(heroHeading.chars, {
    opacity: 0,
    y: 20,
    duration: 0.2,
    stagger: 0.05,
  });
}
animateWithGsap();

function checkIfLoaded() {
  const pageLoader = document.querySelector(".loader");
  if (document.readyState === "complete") {
    // If all images and the 3D model are loaded, remove the loader
    gsap.to(pageLoader, {
      yPercent: -100,
      duration: 1,
      display: "none",
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  if (isLargeScreen()) {
    initThree();
  } else {
    window.onload = checkIfLoaded;
    showHeroImgOnSmallDevices();
  }
});
