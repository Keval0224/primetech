/* ==============================
   UI INTERACTIONS
   ============================== */

// Show Menu
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if(navToggle){
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if(navClose){
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Remove Menu Mobile
const navLink = document.querySelectorAll('.nav-link');
const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

// Change Background Header
const scrollHeader = () =>{
    const header = document.getElementById('header')
    if(window.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/* ==============================
   THREE.JS 3D HERO ANIMATION
   ============================== */

const container = document.getElementById('canvas-container');

if (container && typeof THREE !== 'undefined') {
    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 2;
    camera.position.x = 2;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 4. Create Stylized Laptop Model
    const laptopGroup = new THREE.Group();

    // Material with neon/glass aesthetic
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111625,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    const edgeGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x00f2fe,
        emissiveIntensity: 1,
    });

    // Laptop Base
    const baseGeometry = new THREE.BoxGeometry(5.2, 0.1, 3.6);
    const laptopBase = new THREE.Mesh(baseGeometry, bodyMaterial);
    laptopGroup.add(laptopBase);

    // Glowing rim for base
    const baseEdgeGeo = new THREE.BoxGeometry(5.24, 0.02, 3.64);
    const baseEdge = new THREE.Mesh(baseEdgeGeo, edgeGlowMaterial);
    baseEdge.position.y = 0.0;
    laptopGroup.add(baseEdge);

    // Keyboard Desk (Recessed)
    const kbDeskGeo = new THREE.BoxGeometry(4.8, 0.11, 1.6);
    const kbDeskMat = new THREE.MeshBasicMaterial({ color: 0x050a15 });
    const kbDesk = new THREE.Mesh(kbDeskGeo, kbDeskMat);
    kbDesk.position.y = 0.01;
    kbDesk.position.z = -0.4;
    laptopGroup.add(kbDesk);

    // Grid of glowing keys
    const keysGroup = new THREE.Group();
    const keyGeo = new THREE.BoxGeometry(0.2, 0.02, 0.2);
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x8b5cf6, emissiveIntensity: 0.4 });
    const keyAccentMat = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x00f2fe, emissiveIntensity: 0.7 });
    
    // Create a 20x5 grid of keys
    for(let i=0; i<20; i++){
        for(let j=0; j<5; j++){
            const isAccent = Math.random() > 0.9;
            const key = new THREE.Mesh(keyGeo, isAccent ? keyAccentMat : keyMat);
            key.position.set(-2.2 + (i*0.231), 0.07, -0.85 + (j*0.231));
            keysGroup.add(key);
        }
    }
    laptopGroup.add(keysGroup);

    // Touchpad
    const padGeo = new THREE.BoxGeometry(1.4, 0.12, 0.9);
    const pad = new THREE.Mesh(padGeo, kbDeskMat);
    pad.position.set(0, 0.01, 1.0);
    laptopGroup.add(pad);

    // Laptop Lid (Screen container)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.05, -1.7); // Hinge joint location

    const lidGeometry = new THREE.BoxGeometry(5.2, 3.6, 0.1);
    lidGeometry.translate(0, 1.8, 0); 
    const laptopLid = new THREE.Mesh(lidGeometry, bodyMaterial);
    lidGroup.add(laptopLid);

    // Canvas Texture for Screen
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Draw static high-tech UI on canvas
    const drawScreen = () => {
        const grd = ctx.createLinearGradient(0, 0, 1024, 512);
        grd.addColorStop(0, "#050a15");
        grd.addColorStop(1, "#0a1122");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1024, 512);
        
        ctx.strokeStyle = "rgba(0, 242, 254, 0.1)";
        ctx.lineWidth = 1;
        for(let i=0; i<1024; i+=32) {
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke();
        }
        for(let i=0; i<512; i+=32) {
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(1024,i); ctx.stroke();
        }
        ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
        ctx.fillRect(80, 80, 360, 240);
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = 2;
        ctx.strokeRect(80, 80, 360, 240);
        
        ctx.fillStyle = "#00f2fe";
        ctx.font = "bold 28px monospace";
        ctx.fillText("SYSTEM INITIALIZING...", 110, 130);
        ctx.fillRect(110, 160, 240, 8);

        ctx.font = "16px monospace";
        ctx.fillText("> Boot sequence initiated...", 110, 210);
        ctx.fillText("> Connecting to secure server...", 110, 240);
        ctx.fillText("> Environment mapping: OK", 110, 270);
        
        ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
        ctx.fillRect(490, 200, 40, 120);
        ctx.fillRect(550, 150, 40, 170);
        ctx.fillRect(610, 80, 40, 240);
        ctx.fillRect(670, 180, 40, 140);
        ctx.fillRect(730, 220, 40, 100);
        
        ctx.beginPath();
        ctx.arc(880, 200, 80, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(880, 200, 60, -Math.PI / 2, Math.PI);
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#00f2fe";
        ctx.stroke();
    };
    drawScreen();
    
    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    const screenMaterial = new THREE.MeshBasicMaterial({
        map: screenTexture,
        color: 0xffffff
    });
    
    const screenGeo = new THREE.PlaneGeometry(5.0, 3.4);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, 1.8, 0.051);
    lidGroup.add(screenMesh);

    // Glowing screen bezel interior
    const bezelGeo = new THREE.BoxGeometry(5.2, 3.6, 0.05);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 1.8, 0.02);
    lidGroup.add(bezel);

    // Rotate Lid back slightly
    lidGroup.rotation.x = -0.15; 

    laptopGroup.add(lidGroup);
    
    // Add holographic sphere around laptop for extra coolness
    const holoGeo = new THREE.IcosahedronGeometry(7, 1);
    const holoMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.1 });
    const holoSphere = new THREE.Mesh(holoGeo, holoMat);
    laptopGroup.add(holoSphere);

    // Initial position/rotation of the whole laptop
    laptopGroup.rotation.y = -0.5;
    laptopGroup.rotation.x = 0.2;
    scene.add(laptopGroup);

    // Floating Particles for extra effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Spread particles around
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 2.5);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2.5);
    pointLight2.position.set(-2, 3, 2);
    scene.add(pointLight2);

    // 6. Interaction / Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // 7. Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Target rotation based on mouse
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Smooth rotation interpolation
        laptopGroup.rotation.y += 0.05 * (targetX - laptopGroup.rotation.y) - 0.002;
        laptopGroup.rotation.x += 0.05 * (targetY - laptopGroup.rotation.x) + 0.0005;

        // Floating effect
        laptopGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.2;

        // Rotate holographic sphere
        holoSphere.rotation.y += 0.0015;
        holoSphere.rotation.x += 0.001;

        // Rotate particles slowly
        particlesMesh.rotation.y = -elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Dynamic light color shifting
        pointLight.intensity = Math.sin(elapsedTime * 2) * 0.5 + 1.5;

        renderer.render(scene, camera);
    }
    animate();

    // 8. Resize Handler
    window.addEventListener('resize', () => {
        if(container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}
