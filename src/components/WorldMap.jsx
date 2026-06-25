import { useEffect, useState } from 'react'

// 等距投影：经纬度 → viewBox(0 0 360 180) 坐标
// x = 经度 + 180，y = 90 - 纬度（北在上）
const toXY = ([lon, lat]) => `${(lon + 180).toFixed(2)},${(90 - lat).toFixed(2)}`

function buildPaths(geojson) {
  const paths = []
  geojson.features.forEach((f) => {
    const g = f.geometry
    const polys =
      g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []
    polys.forEach((poly) => {
      let d = ''
      poly.forEach((ring) => {
        ring.forEach((pt, i) => {
          d += (i === 0 ? 'M' : 'L') + toXY(pt) + ' '
        })
        d += 'Z'
      })
      if (d) paths.push(d)
    })
  })
  return paths
}

// 平面世界地图背景（真实陆地轮廓，暗色档案馆风）
export default function WorldMap() {
  const [paths, setPaths] = useState([])

  useEffect(() => {
    fetch('/world-land.json')
      .then((r) => r.json())
      .then((j) => setPaths(buildPaths(j)))
      .catch(() => {})
  }, [])

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 360 180"
      preserveAspectRatio="none"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="rgba(201,162,75,0.05)"
          stroke="rgba(201,162,75,0.22)"
          strokeWidth="0.18"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
