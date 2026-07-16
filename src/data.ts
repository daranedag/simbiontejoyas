export type PortfolioItem = {
  id: string
  title: string
  alt: string
  image: string
  width: number
  height: number
}

// Phase 1 placeholder data. The future backend can replace this module with its API client.
const placeholder = (id: string, palette: string, shape: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
      <defs>
        <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.split(',')[0]}"/><stop offset="1" stop-color="${palette.split(',')[1]}"/></linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="16"/></filter>
      </defs>
      <rect width="1200" height="1500" fill="url(#bg-${id})"/>
      <circle cx="225" cy="280" r="250" fill="#fff" opacity=".12" filter="url(#soft)"/>
      <circle cx="1020" cy="1210" r="320" fill="#111" opacity=".08" filter="url(#soft)"/>
      ${shape}
      <text x="600" y="1415" text-anchor="middle" fill="#fff" fill-opacity=".76" font-family="Georgia,serif" font-size="24" letter-spacing="7">SIMBIONTE</text>
    </svg>`)

export const portfolio: PortfolioItem[] = [
  { id: '01', title: 'Pieza en proceso', alt: 'Marcador de posición para una joya artesanal', image: placeholder('01', '#4f4238,#a1795e', '<ellipse cx="600" cy="740" rx="230" ry="400" fill="none" stroke="#d9bc7a" stroke-width="36" transform="rotate(-27 600 740)"/><circle cx="670" cy="600" r="100" fill="#8f6558" opacity=".9"/>'), width: 1200, height: 1500 },
  { id: '02', title: 'Texturas vivas', alt: 'Marcador de posición para una joya artesanal', image: placeholder('02', '#263638,#718270', '<path d="M310 1040 C230 580 550 250 800 470 C1050 690 810 1160 480 1030 C390 995 365 915 440 855 C520 795 660 870 690 735 C720 600 535 570 505 700" fill="none" stroke="#cfbb8d" stroke-width="35" stroke-linecap="round"/>'), width: 1200, height: 1500 },
  { id: '03', title: 'Materia y forma', alt: 'Marcador de posición para una joya artesanal', image: placeholder('03', '#a69b8d,#5d5b55', '<path d="M600 380 C830 510 945 700 810 985 C675 1165 440 1115 385 860 C330 610 420 445 600 380Z" fill="#c8b07b" opacity=".9"/><path d="M600 490 C730 590 770 750 680 900 C590 985 465 895 485 750 C505 620 530 540 600 490Z" fill="#6f6255"/>'), width: 1200, height: 1500 },
  { id: '04', title: 'Detalle orgánico', alt: 'Marcador de posición para una joya artesanal', image: placeholder('04', '#704e45,#c69e75', '<circle cx="600" cy="740" r="305" fill="none" stroke="#e2c68f" stroke-width="28"/><circle cx="600" cy="435" r="105" fill="#5d8776"/><circle cx="600" cy="1045" r="105" fill="#5d8776"/>'), width: 1200, height: 1500 },
  { id: '05', title: 'Serie única', alt: 'Marcador de posición para una joya artesanal', image: placeholder('05', '#b39778,#52463d', '<path d="M365 1030 C270 850 385 690 525 700 C450 510 685 370 815 535 C935 690 845 890 685 950 C585 987 500 920 540 820" fill="none" stroke="#f0d391" stroke-width="36" stroke-linecap="round"/>'), width: 1200, height: 1500 },
  { id: '06', title: 'Próxima creación', alt: 'Marcador de posición para una joya artesanal', image: placeholder('06', '#3c4d4b,#9d9079', '<rect x="380" y="440" width="440" height="600" rx="220" fill="none" stroke="#d9c08b" stroke-width="34" transform="rotate(35 600 740)"/><circle cx="760" cy="590" r="92" fill="#b46e5e"/>'), width: 1200, height: 1500 },
]
