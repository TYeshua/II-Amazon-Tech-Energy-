import { useCallback, useEffect, useRef, useState } from 'react'

interface Props { items:string[]; onSelect:(index:number)=>void }

export default function OptionWheel({items,onSelect}:Props){
  const root=useRef<HTMLDivElement>(null), refs=useRef<(HTMLDivElement|null)[]>([])
  const pos=useRef(0), target=useRef(0), frame=useRef<number|null>(null), last=useRef(0)
  const drag=useRef<{y:number;start:number;id:number}|null>(null), moved=useRef(false)
  const [selected,setSelected]=useState(0)
  const layout=useCallback((value:number)=>{refs.current.forEach((el,index)=>{if(!el)return;const d=index-value,a=Math.max(-.72,Math.min(.72,d*.17)),x=-360*(1-Math.cos(a)),y=360*Math.sin(a),dist=Math.abs(d);el.style.transform=`translate(${x.toFixed(1)}px,calc(${y.toFixed(1)}px - 50%)) rotate(${(-a*18).toFixed(2)}deg)`;el.style.opacity=String(Math.max(.18,1-dist*.2));el.style.filter=`blur(${Math.max(0,dist-1)*.55}px)`;el.style.setProperty('--wheel-progress',String(Math.max(0,1-Math.min(dist,1))))})},[])
  const animate=useCallback((now:number)=>{const dt=Math.min((now-last.current)/1000,.05);last.current=now;const next=pos.current+(target.current-pos.current)*(1-Math.exp(-dt/.16));pos.current=Math.abs(target.current-next)<.001?target.current:next;layout(pos.current);frame.current=pos.current===target.current?null:requestAnimationFrame(animate)},[layout])
  const start=useCallback(()=>{if(frame.current!==null)return;last.current=performance.now();frame.current=requestAnimationFrame(animate)},[animate])
  const choose=useCallback((value:number)=>{const next=Math.max(0,Math.min(items.length-1,Math.round(value)));target.current=next;setSelected(next);start()},[items.length,start])
  useEffect(()=>{layout(0);return()=>{if(frame.current!==null)cancelAnimationFrame(frame.current)}},[layout])
  useEffect(()=>{const el=root.current;if(!el)return;const wheel=(e:WheelEvent)=>{e.preventDefault();choose(target.current+(e.deltaY>0?1:-1))};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[choose])
  return <div ref={root} className="option-wheel" role="listbox" tabIndex={0} aria-label="Navegação do site"
    onPointerDown={e=>{drag.current={y:e.clientY,start:target.current,id:e.pointerId};moved.current=false}}
    onPointerMove={e=>{if(!drag.current)return;const dy=e.clientY-drag.current.y;if(Math.abs(dy)>5){moved.current=true;root.current?.setPointerCapture(drag.current.id);target.current=Math.max(0,Math.min(items.length-1,drag.current.start-dy/58));start()}}}
    onPointerUp={()=>{if(drag.current&&moved.current)choose(target.current);drag.current=null}}
    onPointerCancel={()=>{drag.current=null}}
    onKeyDown={e=>{if(e.key==='ArrowUp'){e.preventDefault();choose(target.current-1)}if(e.key==='ArrowDown'){e.preventDefault();choose(target.current+1)}if(e.key==='Enter')onSelect(selected)}}>
    {items.map((item,index)=><div key={item} ref={el=>{refs.current[index]=el}} className="option-wheel__item" role="option" aria-selected={selected===index} onClick={()=>{if(moved.current)return;selected===index?onSelect(index):choose(index)}}>{item}</div>)}
  </div>
}
