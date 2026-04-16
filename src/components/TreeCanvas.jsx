import { useEffect, useRef } from "react";
import { useTreeStore, BRANCH_COLORS } from "../store/useTreeStore";

export default function TreeCanvas() {
  const canvasRef = useRef(null);
  const branches = useTreeStore((s) => s.branches);

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
      ctx.ellipse(160+(rand()*60-30),370+(rand()*15-7.5),60+rand()*40,8+rand()*12,0,0,Math.PI*2);
      ctx.fillStyle="#c5b8a5"; ctx.globalAlpha=0.04; ctx.fill();
    }
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(160+(rand()*120-60),370+(rand()*30-15),rand()*1.5+0.5,0,Math.PI*2);
      ctx.fillStyle="#a89b88"; ctx.globalAlpha=rand()*0.4+0.1; ctx.fill();
    }
    ctx.restore();

    const drawBlob = (x, y, r, color) => {
      ctx.fillStyle = color;
      for (let i=0;i<50;i++){const ra=(rand()*0.6+0.4)*r,a=rand()*Math.PI*2,d=Math.pow(rand(),2)*r*1.5;ctx.beginPath();ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,ra,0,Math.PI*2);ctx.globalAlpha=rand()*0.05+0.01;ctx.fill();}
      for (let i=0;i<30;i++){const ra=rand()*r*0.4+2,a=rand()*Math.PI*2,d=rand()*r*1.3;ctx.beginPath();ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,ra,0,Math.PI*2);ctx.globalAlpha=rand()*0.1+0.02;ctx.fill();}
      for (let i=0;i<20;i++){const ra=rand()*2.5+0.2,a=rand()*Math.PI*2,d=rand()*r*2.5+r*0.5;ctx.beginPath();ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,ra,0,Math.PI*2);ctx.globalAlpha=rand()*0.3+0.05;ctx.fill();}
    };

    // Trunk
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(145,380); ctx.quadraticCurveTo(165,290,162,215);
    ctx.quadraticCurveTo(158,145,130,88); ctx.lineTo(134,86);
    ctx.quadraticCurveTo(165,138,168,185); ctx.quadraticCurveTo(195,125,228,102);
    ctx.lineTo(232,106); ctx.quadraticCurveTo(183,137,176,215);
    ctx.quadraticCurveTo(178,290,183,380); ctx.closePath();
    const tg = ctx.createLinearGradient(145,380,180,90);
    tg.addColorStop(0,"#2c2621"); tg.addColorStop(0.5,"#423831"); tg.addColorStop(1,"#261f1a");
    ctx.fillStyle=tg; ctx.globalAlpha=0.85; ctx.fill();
    ctx.globalCompositeOperation="source-atop";
    ctx.strokeStyle="#120e0a"; ctx.lineWidth=0.5;
    for(let i=0;i<25;i++){ctx.beginPath();ctx.moveTo(140+rand()*50,385);ctx.quadraticCurveTo(165+rand()*20,245,120+rand()*120,78);ctx.globalAlpha=rand()*0.2+0.05;ctx.stroke();}
    ctx.globalCompositeOperation="multiply";
    ctx.restore();

    // Branches
    const br = (x1,y1,cpx,cpy,x2,y2,w) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(cpx,cpy,x2,y2);
      ctx.strokeStyle="#382e26"; ctx.lineWidth=w; ctx.lineCap="round"; ctx.globalAlpha=0.7; ctx.stroke();
    };
    br(162,215,140,175,100,148,2.5); br(115,158,90,148,70,138,1.2); br(125,165,105,185,95,202,1);
    br(170,196,200,176,233,162,2);   br(213,169,228,152,248,142,1); br(188,184,213,202,228,212,1.2);
    br(140,112,120,102,105,92,1.5);  br(155,127,170,97,183,72,1.8);  br(173,92,193,77,208,67,1);

    // Blobs per completed checkpoint
    const strokes = branches.flatMap((b) => {
      const col = BRANCH_COLORS.find((c) => c.id === b.colorId);
      return b.checkpoints.filter((cp) => cp.done).map(() => col.paint);
    });

    strokes.forEach((color, i) => {
      const dist = Math.sqrt(i) * 15 + rand() * 10;
      const angle = i * 2.39996 + rand() * 0.5;
      const x = 160 + Math.cos(angle) * dist * 1.3;
      const y = 125 + Math.sin(angle) * dist * 0.9;
      const r = 25 + rand() * 15 + (i < 5 ? 10 : 0);
      drawBlob(x, y, r, color);
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