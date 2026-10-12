/* Homepage workflow choreography: send, receive, process, then forward.
   Capture drawing targets while planning; replay/Next settles every pending effect. */
(()=>{'use strict';
window.createStoryTimeline=scene=>{
 const motion=window.WorfMotion.workflow,reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 let planning=false,capture=null,flows=[],effects=[],active=[],ends=[];
 function render(id,draw){
  if(capture){capture.add(id);return true;}
  if(!planning)return false;
  effects.push({targets:[id],draw,end:draw,duration:0});return true;
 }
 function animate(draw){
  capture=new Set();try{draw(0);}finally{const targets=[...capture];capture=null;effects.push({targets,draw,end:()=>draw(1),duration:motion.responseDuration});}
 }
 function flush(){
  planning=false;
  scene.storyFlowEdges=new Set(flows.map(f=>f.from+'>'+f.to));
  // A return edge closes a feedback loop; it does not delay the initial sender.
  const dependencies=[];
  const reaches=(a,b,seen=new Set())=>a===b||(!seen.has(a)&&(seen.add(a),dependencies.some(e=>e.from===a&&reaches(e.to,b,seen))));
  for(const f of flows)if(!reaches(f.to,f.from))dependencies.push(f);
  const arrival=(id,seen=new Set())=>{
   if(seen.has(id))return 0;
   const next=new Set(seen);next.add(id);
   return Math.max(0,...dependencies.filter(f=>f.to===id).map(f=>arrival(f.from,next)+processing(f)+motion.flowDuration));
  };
  const processing=f=>dependencies.some(e=>e.to===f.from)?Math.max(0,...effects.filter(e=>e.duration&&e.targets.includes(f.from)&&!e.targets.includes(f.to)).map(e=>e.duration)):0;
  const received=new Map();
  for(const f of flows){f.delay=arrival(f.from)+processing(f);received.set(f.to,Math.max(received.get(f.to)||0,f.delay+motion.flowDuration));}
  const jobs=effects.map(e=>({...e,delay:Math.max(0,...e.targets.map(id=>received.get(id)||0))})).sort((a,b)=>a.delay-b.delay);
  ends=jobs.map(e=>e.end);
  if(reduced()){ends.splice(0).forEach(end=>end());return 0;}
  flows.forEach(f=>f.draw(f.delay,motion.flowDuration));
  jobs.forEach(e=>active.push(scene.tweens.addCounter({from:0,to:1,delay:e.delay,duration:e.duration||1,ease:motion.ease,onUpdate:t=>{if(e.duration)e.draw(t.getValue());},onComplete:e.duration?undefined:e.draw})));
  return Math.max(0,...flows.map(f=>f.delay+motion.flowDuration+2*motion.packetStagger),...jobs.map(e=>e.delay+e.duration));
 }
 function finish(){active.splice(0).forEach(t=>t.stop());ends.splice(0).forEach(end=>end());planning=false;flows=[];effects=[];scene.storyFlowEdges=new Set();}
 return{begin(){finish();planning=true;},render,animate,flow(from,to,draw){flows.push({from,to,draw});},flush,finish};
};
})();
