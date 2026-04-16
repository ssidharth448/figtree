import { useEffect, useRef } from "react";
import { useTreeStore, BRANCH_COLORS } from "../store/useTreeStore";

export default function TreeCanvas({ overrideBranches }) {
  const canvasRef = useRef(null);
  const storeBranches = useTreeStore((s) => s.branches);
  const branches = overrideBranches || storeBranches;

  useEffect(() => {
    let seed = 42;
    const rand = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "multiply";

    // Ground
    ctx.save();
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.ellipse(160 + (rand() * 60 - 30), 370 + (rand() * 15 - 7.5), 60 + rand() * 40, 8 + rand() * 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#c5b8a5"; ctx.globalAlpha = 0.04; ctx.fill();
    }
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(160 + (rand() * 120 - 60), 370 + (rand() * 30 - 15), rand() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "#a89b88"; ctx.globalAlpha = rand() * 0.4 + 0.1; ctx.fill();
    }
    ctx.restore();

    const drawBlob = (x, y, r, color) => {
      ctx.fillStyle = color;
      for (let i = 0; i < 50; i++) { const ra = (rand() * 0.6 + 0.4) * r, a = rand() * Math.PI * 2, d = Math.pow(rand(), 2) * r * 1.5; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, ra, 0, Math.PI * 2); ctx.globalAlpha = rand() * 0.05 + 0.01; ctx.fill(); }
      for (let i = 0; i < 30; i++) { const ra = rand() * r * 0.4 + 2, a = rand() * Math.PI * 2, d = rand() * r * 1.3; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, ra, 0, Math.PI * 2); ctx.globalAlpha = rand() * 0.1 + 0.02; ctx.fill(); }
      for (let i = 0; i < 20; i++) { const ra = rand() * 2.5 + 0.2, a = rand() * Math.PI * 2, d = rand() * r * 2.5 + r * 0.5; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, ra, 0, Math.PI * 2); ctx.globalAlpha = rand() * 0.3 + 0.05; ctx.fill(); }
    };

    // Trunk
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(110, 390);
    ctx.quadraticCurveTo(145, 340, 150, 215);
    ctx.quadraticCurveTo(152, 145, 125, 88);
    ctx.lineTo(130, 85);
    ctx.quadraticCurveTo(165, 138, 170, 185);
    ctx.quadraticCurveTo(198, 125, 232, 102);
    ctx.lineTo(236, 106);
    ctx.quadraticCurveTo(185, 137, 182, 215);
    ctx.quadraticCurveTo(188, 340, 220, 390);
    ctx.quadraticCurveTo(165, 375, 110, 390);
    ctx.closePath();
    const tg = ctx.createLinearGradient(145, 390, 190, 90);
    tg.addColorStop(0, "#1f1a16"); tg.addColorStop(0.5, "#3b3028"); tg.addColorStop(1, "#261f1a");
    ctx.fillStyle = tg; ctx.globalAlpha = 0.9; ctx.fill();
    ctx.globalCompositeOperation = "source-atop";
    ctx.strokeStyle = "#000"; ctx.lineWidth = 0.4;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.moveTo(110 + rand() * 110, 395);
      ctx.quadraticCurveTo(140 + rand() * 40, 245, 115 + rand() * 125, 78);
      ctx.globalAlpha = rand() * 0.15 + 0.02;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "multiply";
    ctx.restore();

    // Branches
    if (branches && branches.length > 0) {
      const br = (x1, y1, cpx, cpy, x2, y2, w) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.strokeStyle = "#382e26"; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.globalAlpha = 0.8; ctx.stroke();
      };
      br(150, 215, 130, 175, 90, 148, 3); br(100, 158, 80, 148, 60, 138, 1.5); br(115, 165, 95, 185, 85, 202, 1.2);
      br(172, 196, 205, 176, 240, 162, 2.5); br(218, 169, 235, 152, 255, 142, 1.2); br(192, 184, 220, 202, 235, 212, 1.5);
      br(135, 112, 110, 102, 95, 92, 2); br(155, 127, 175, 97, 190, 72, 2.2); br(175, 92, 195, 77, 215, 67, 1.2);
    }

    // Leaves and Blooms
    const blooms = [];

    if (branches) {
      branches.forEach((b, i) => {
        const col = BRANCH_COLORS[i % BRANCH_COLORS.length];

        const collectItems = (branch) => {
          if (branch.items) {
            branch.items.forEach(item => {
              if (item.done) blooms.push({ color: col.paint, item });
            });
          }
          if (branch.subs) {
            branch.subs.forEach(collectItems);
          }
        };

        collectItems(b);
      });
    }

    blooms.forEach((bloom, i) => {
      const dist = Math.sqrt(i) * 15 + rand() * 10;
      const angle = i * 2.39996 + rand() * 0.5;
      const x = 160 + Math.cos(angle) * dist * 1.3;
      const y = 125 + Math.sin(angle) * dist * 0.9;
      const r = 25 + rand() * 15 + (i < 5 ? 10 : 0);
      drawBlob(x, y, r, bloom.color);
    });
  }, [branches]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={380}
      style={{ width: "100%", maxWidth: "300px", display: "block" }}
    />
  );
}