import * as THREE from 'three';

/** An original imagined landscape, not a map or a reconstruction of a sacred site. */
export function mountJourney(host: HTMLElement, fail: () => void) {
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,40);camera.position.set(0,3.5,7.5);camera.lookAt(0,0,0);
 const columns=innerWidth<768?65:100,rows=65,count=columns*rows;
 const positions=new Float32Array(count*3),base=new Float32Array(count*3);
 for(let i=0;i<count;i++){const x=(i%columns)/(columns-1)*6-3,z=Math.floor(i/columns)/(rows-1)*4-2;const ridge=Math.sin(x*1.7+z*.6)*Math.cos(z*1.3)*.55+Math.exp(-((x-.4)**2+z*z)*.8)*1.3;base.set([x,ridge-.35,z],i*3);}positions.set(base);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const material=new THREE.PointsMaterial({color:0xc9a281,size:.026,transparent:true,opacity:.85,depthWrite:false});const terrain=new THREE.Points(geometry,material);scene.add(terrain);
 const contourMaterial=new THREE.LineBasicMaterial({color:0xa8b3a1,transparent:true,opacity:.18});const contours=new THREE.Group();scene.add(contours);const lines:THREE.BufferGeometry[]=[];
 for(let row=0;row<rows;row+=5){const points=[];for(let col=0;col<columns;col++){const j=(row*columns+col)*3;points.push(new THREE.Vector3(base[j],base[j+1]-.02,base[j+2]));}const g=new THREE.BufferGeometry().setFromPoints(points);lines.push(g);contours.add(new THREE.Line(g,contourMaterial));}
 let paused=false,visible=true,disposed=false,frame=0,time=0,last=0,progress=1,mx=0,my=0;
 const draw=()=>{if(!disposed)renderer.render(scene,camera);};
 const tick=(stamp:number)=>{frame=0;if(disposed||paused||!visible||document.hidden)return;time+=Math.min((stamp-last)/1000,.05);last=stamp;terrain.rotation.y=contours.rotation.y=Math.sin(time*.09)*.07+mx*.1;terrain.rotation.x=contours.rotation.x=my*.04+(progress-1)*.16;for(let i=0;i<count;i++){positions[i*3+1]=base[i*3+1]+Math.sin(time*.4+base[i*3]*.7)*.022;}geometry.attributes.position.needsUpdate=true;draw();frame=requestAnimationFrame(tick);};
 const sync=()=>{cancelAnimationFrame(frame);frame=0;draw();if(!paused&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}};
 const resize=new ResizeObserver(()=>{const r=host.getBoundingClientRect();if(r.width&&r.height){renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();draw();}});resize.observe(host);
 const move=(event:PointerEvent)=>{const r=host.getBoundingClientRect();mx=(event.clientX-r.left)/r.width-.5;my=(event.clientY-r.top)/r.height-.5;};
 const lost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);fail();};window.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',sync);renderer.domElement.addEventListener('webglcontextlost',lost);sync();
 return {update(p:number,stop:boolean,onScreen:boolean){progress=p;const changed=paused!==stop||visible!==onScreen;paused=stop;visible=onScreen;if(changed||paused)sync();},dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',sync);renderer.domElement.removeEventListener('webglcontextlost',lost);geometry.dispose();material.dispose();lines.forEach(g=>g.dispose());contourMaterial.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}};
}
