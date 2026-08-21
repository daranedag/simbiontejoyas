import heroImageFile from '../inspiracion/Fotitos Clau-4.jpg'
import lichenRedFile from '../inspiracion/Fotos ClauDoñas-6.jpg'
import lichenGreenFile from '../inspiracion/Fotos ClauDoñas-3.jpg'
import lichenYellowFile from '../inspiracion/Fotitos Clau-1 (1).jpg'
import lichenTextureFile from '../inspiracion/Fotitos Clau-2 (1) (1).jpg'
import lichenLandscapeFile from '../inspiracion/Fotitos Clau-3 (1) (1).jpg'
import silverPieceFile from '../inspiracion/DSC_7682-Enhanced-NR.jpg'
import aboutPhotoOneFile from './assets/sobreMi_1.png'
import aboutPhotoTwoFile from './assets/sobreMi_2.png'
import aboutPhotoThreeFile from './assets/sobreMi_3.png'

const heroImage = heroImageFile.src
const lichenRed = lichenRedFile.src
const lichenGreen = lichenGreenFile.src
const lichenYellow = lichenYellowFile.src
const lichenTexture = lichenTextureFile.src
const lichenLandscape = lichenLandscapeFile.src
const silverPiece = silverPieceFile.src
const aboutPhotoOne = aboutPhotoOneFile.src
const aboutPhotoTwo = aboutPhotoTwoFile.src
const aboutPhotoThree = aboutPhotoThreeFile.src

export type PortfolioItem = {
  id: string
  title: string
  alt: string
  image: string
  width: number
  height: number
}

export type AboutSlide = {
  image: string
  alt: string
}

export type ProcessCard = {
  title: string
  content: string
  image: string
  alt: string
}

export { heroImage }

export const portfolio: PortfolioItem[] = [
  { id: '01', title: 'Micromundos', alt: 'Líquenes rojos sobre una superficie natural', image: lichenRed, width: 2048, height: 1365 },
  { id: '02', title: 'Materia viva', alt: 'Detalle de líquenes sobre corteza', image: lichenGreen, width: 2048, height: 1365 },
  { id: '03', title: 'Tramas', alt: 'Textura amarilla de líquenes sobre roca', image: lichenYellow, width: 2048, height: 1365 },
  { id: '04', title: 'Hallazgos', alt: 'Joya de plata con forma vegetal', image: silverPiece, width: 2048, height: 1365 },
  { id: '05', title: 'Ritmos', alt: 'Líquenes naranjos sobre una piedra', image: lichenTexture, width: 2048, height: 1365 },
  { id: '06', title: 'Territorio', alt: 'Roca cubierta de líquenes amarillos', image: lichenLandscape, width: 2048, height: 1365 },
]

export const aboutSlides: AboutSlide[] = [
  { image: aboutPhotoOne, alt: 'Fotografía de Claudia Lagos para la sección Sobre mí' },
  { image: aboutPhotoTwo, alt: 'Fotografía de Claudia Lagos para la sección Sobre mí' },
  { image: aboutPhotoThree, alt: 'Fotografía de Claudia Lagos para la sección Sobre mí' },
]

export const processCards: ProcessCard[] = [
  { title: 'Cercanía con lo vivo', content: 'Hago joyas desde la cercanía con lo vivo.', image: lichenRed, alt: 'Líquenes rojos sobre una superficie natural' },
  { title: 'Detener la mirada', content: 'Detengo la mirada en esos gestos mínimos del paisaje: una textura, un brote, una piedra. Simbionte es un modo de guardar esos encuentros y llevarlos cerca.', image: lichenGreen, alt: 'Detalle de líquenes sobre corteza' },
  { title: 'La voz de la materia', content: 'Trabajo lentamente, dejando que el metal, sus huellas y sus accidentes construyan una forma única. Cada pieza es una conversación entre el oficio y aquello que inspira.', image: lichenYellow, alt: 'Textura amarilla de líquenes sobre roca' },
  { title: 'Observar', content: 'Lo pequeño revela formas, texturas y ritmos que guían cada pieza.', image: lichenTexture, alt: 'Líquenes naranjos sobre una piedra' },
  { title: 'Recoger', content: 'El paisaje del sur acompaña el imaginario de Simbionte.', image: lichenLandscape, alt: 'Roca cubierta de líquenes amarillos' },
  { title: 'Transformar', content: 'La materia cambia de escala para encontrar su lugar en el cuerpo.', image: silverPiece, alt: 'Joya de plata con forma vegetal' },
]
