import { Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import OptionWheel from './OptionWheel'

const links = [['Sobre o evento','#sobre'],['Programação','#debate'],['Palestrantes','#debate'],['Organização','#bacia'],['Inscrição','#debate']]

export function SiteHeader(){
  const [open,setOpen]=useState(false),[query,setQuery]=useState('')
  const shell=useRef<HTMLDivElement>(null)
  useEffect(()=>{const esc=(e:KeyboardEvent)=>e.key==='Escape'&&setOpen(false);addEventListener('keydown',esc);return()=>removeEventListener('keydown',esc)},[])
  useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(shell.current&&!shell.current.contains(e.target as Node))setOpen(false)};const timer=setTimeout(()=>addEventListener('pointerdown',close),0);return()=>{clearTimeout(timer);removeEventListener('pointerdown',close)}},[open])
  const results=query?links.filter(([name])=>name.toLowerCase().includes(query.toLowerCase())):[]
  const navigate=(index:number)=>{location.hash=links[index][1];setOpen(false)}
  return <header className="site-header">
    <a className="mini-brand" href="#sobre" aria-label="Amazon Tech Energy"><span className="brand-mark">⚙</span><span>2º AMAZON<br/>TECH ENERGY</span></a>
    <nav className="desktop-nav" aria-label="Navegação principal">{links.slice(0,-1).map(([name,href])=><a key={name} href={href}>{name}</a>)}</nav>
    <div className="search-wrap"><label className="sr-only" htmlFor="site-search">Buscar</label><input id="site-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="PROCURE POR INFORMAÇÕES" aria-expanded={!!results.length}/><Search size={15}/>{results.length>0&&<div className="search-results">{results.map(([name,href])=><a href={href} key={name} onClick={()=>setQuery('')}>{name}</a>)}</div>}</div>
    <a className="register" href="#debate">Inscrição</a>
    <div className="mobile-menu-shell" ref={shell}><button className="menu-button" onClick={()=>setOpen(value=>!value)} aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open}>{open?<X/>:<Menu/>}</button>{open&&<div className="mobile-panel"><span className="mobile-panel__eyebrow">NAVEGUE</span><OptionWheel items={links.map(([name])=>name)} onSelect={navigate}/></div>}</div>
  </header>
}
