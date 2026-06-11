export default function LoadingSpinner({ size = 20 }) {
  return (
    <svg className="anim-spin" width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ display:"inline-block", flexShrink:0 }}>
      <circle cx={12} cy={12} r={10} stroke="rgba(255,255,255,0.15)" strokeWidth={2.5}/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth={2.5} strokeLinecap="round"/>
    </svg>
  );
}
