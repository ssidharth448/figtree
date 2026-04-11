import { useEffect, useRef } from "react";
import { useTreeStore } from "../store/useTreeStore";

export default function TreeCanvas() {
  const canvasRef = useRef(null);
  const strokes = useTreeStore((s) => s.strokes);

  useEffect(() => {
    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.globalCompositeOperation = "multiply";

    // Draw subtle ground wash
    ctx.save();
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        const rx = 160 + (random()*60 - 30);
        const ry = 390 + (random()*15 - 7.5);
        ctx.ellipse(rx, ry, 60 + random()*40, 8 + random()*12, 0, 0, Math.PI*2);
        ctx.fillStyle = "#c5b8a5";
        ctx.globalAlpha = 0.04;
        ctx.fill();
    }
    // Ground splatters
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        const rx = 160 + (random()*120 - 60);
        const ry = 390 + (random()*30 - 15);
        ctx.arc(rx, ry, random()*1.5 + 0.5, 0, Math.PI*2);
        ctx.fillStyle = "#a89b88";
        ctx.globalAlpha = random() * 0.4 + 0.1;
        ctx.fill();
    }
    ctx.restore();

    // Watercolor blob function
    const drawWatercolorBlob = (x, y, r, color) => {
      ctx.fillStyle = color;
      
      // Main soft body washes
      for (let i = 0; i < 50; i++) {
        const radius = (random() * 0.6 + 0.4) * r;
        const angle = random() * Math.PI * 2;
        const dist = Math.pow(random(), 2) * r * 1.5;
        const cx = x + Math.cos(angle) * dist;
        const cy = y + Math.sin(angle) * dist;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.globalAlpha = random() * 0.05 + 0.01;
        ctx.fill();
      }
      
      // Crisp edges and pigment pooling
      for (let i = 0; i < 30; i++) {
        const radius = random() * r * 0.4 + 2;
        const angle = random() * Math.PI * 2;
        const dist = random() * r * 1.3;
        const cx = x + Math.cos(angle) * dist;
        const cy = y + Math.sin(angle) * dist;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.globalAlpha = random() * 0.1 + 0.02;
        ctx.fill();
      }

      // Splatters around the brush stroke clump
      for (let i = 0; i < 20; i++) {
        const radius = random() * 2.5 + 0.2;
        const angle = random() * Math.PI * 2;
        const dist = random() * r * 2.5 + r * 0.5;
        const cx = x + Math.cos(angle) * dist;
        const cy = y + Math.sin(angle) * dist;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.globalAlpha = random() * 0.3 + 0.05;
        ctx.fill();
      }
    };

    // Elegant Slender Trunk
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(145, 395); 
    ctx.quadraticCurveTo(165, 300, 162, 220); 
    ctx.quadraticCurveTo(158, 150, 130, 90); // Left peak
    ctx.lineTo(134, 88);
    ctx.quadraticCurveTo(165, 140, 168, 190); 
    ctx.quadraticCurveTo(195, 130, 230, 105); // Right peak
    ctx.lineTo(234, 109);
    ctx.quadraticCurveTo(185, 140, 178, 220); 
    ctx.quadraticCurveTo(180, 300, 185, 395); 
    ctx.closePath();

    const trunkGrad = ctx.createLinearGradient(145, 395, 180, 100);
    trunkGrad.addColorStop(0, "#2c2621");
    trunkGrad.addColorStop(0.5, "#423831");
    trunkGrad.addColorStop(1, "#261f1a");
    
    ctx.fillStyle = trunkGrad;
    ctx.globalAlpha = 0.85;
    ctx.fill();

    // Trunk textures
    ctx.globalCompositeOperation = "source-atop";
    ctx.strokeStyle = "#120e0a";
    ctx.lineWidth = 0.5;
    for(let i=0; i<25; i++) {
        ctx.beginPath();
        ctx.moveTo(140 + random()*50, 400);
        ctx.quadraticCurveTo(165 + random()*20, 250, 120 + random()*120, 80);
        ctx.globalAlpha = random() * 0.2 + 0.05;
        ctx.stroke();
    }
    ctx.globalCompositeOperation = "multiply";
    ctx.restore();

    // Fine Branches
    const drawBranch = (x1, y1, cp1x, cp1y, x2, y2, width) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
        ctx.strokeStyle = "#382e26";
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.7;
        ctx.stroke();
    };

    drawBranch(162, 220, 140, 180, 100, 150, 2.5); // mid-left main
    drawBranch(115, 160, 90, 150, 70, 140, 1.2);   // mid-left sub
    drawBranch(125, 168, 105, 190, 95, 205, 1);    // mid-left droop

    drawBranch(170, 200, 200, 180, 235, 165, 2);   // mid-right main
    drawBranch(215, 172, 230, 155, 250, 145, 1);   // mid-right up
    drawBranch(190, 187, 215, 205, 230, 215, 1.2); // mid-right droop

    drawBranch(140, 115, 120, 105, 105, 95, 1.5);  // upper-left
    drawBranch(155, 130, 170, 100, 185, 75, 1.8);  // upper-center
    drawBranch(175, 95, 195, 80, 210, 70, 1);      // upper-center right

    // Beautiful harmonious colors matching the watercolor swatches
    const colors = [
        "#889b6b", // olive green
        "#d2b17a", // golden ochre
        "#dfab97", // blush pink
        "#6b8682", // muted teal
        "#c7bf82", // pale yellow-green
        "#a28b61"  // earth brown
    ];

    const typeColors = {
        knowledge: "#889b6b", // olive green
        journal: "#dfab97",   // blush pink
        goal: "#6b8682"       // muted teal
    };

    strokes.forEach((strokeType, i) => {
        const cx = 160;
        const cy = 130;
        
        const distance = Math.sqrt(i) * 15 + random() * 10;
        const angle = i * 2.39996 + random() * 0.5;
        
        const x = cx + Math.cos(angle) * distance * 1.3;
        const y = cy + Math.sin(angle) * distance * 0.9;
        
        const radius = 25 + random() * 15 + (i < 5 ? 10 : 0);
        
        const color = typeColors[strokeType] || colors[0];
        
        drawWatercolorBlob(x, y, radius, color);
    });

  }, [strokes]);

  return <canvas ref={canvasRef} width={320} height={420} style={{ width: '100%', maxWidth: '320px' }} />;
}