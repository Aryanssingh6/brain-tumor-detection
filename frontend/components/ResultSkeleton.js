"use client";
/**
 * ResultSkeleton — shimmer loading placeholder for analysis results.
 * Drop-in replacement while awaiting API response.
 */
export default function ResultSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="skel" style={{ width: 90, height: 26, borderRadius: 100 }}/>
          <div className="skel" style={{ width: 80, height: 16, borderRadius: 6 }}/>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="skel" style={{ width: 90, height: 32, borderRadius: 10 }}/>
          <div className="skel" style={{ width: 90, height: 32, borderRadius: 10 }}/>
          <div className="skel" style={{ width: 110, height: 32, borderRadius: 10 }}/>
        </div>
      </div>

      {/* Main grid skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }} className="analysis-grid">
        {/* Left: viewer */}
        <div className="skel" style={{ borderRadius: 18, height: 460 }}/>
        {/* Right: diagnosis cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="skel" style={{ borderRadius: 16, height: 120 }}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="skel" style={{ borderRadius: 16, height: 140 }}/>
            <div className="skel" style={{ borderRadius: 16, height: 140 }}/>
          </div>
          <div className="skel" style={{ borderRadius: 16, height: 120 }}/>
        </div>
      </div>

      {/* Bottom 4-grid skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }} className="four-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skel" style={{ borderRadius: 16, height: 200 }}/>
        ))}
      </div>
    </div>
  );
}
