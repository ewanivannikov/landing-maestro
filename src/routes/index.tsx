import { createFileRoute } from '@tanstack/react-router'
import { Button, Stack, Typography } from '@mui/material'
import z from 'zod'
import {VerticalSlider} from '~/components/VerticalSlider/VerticalSlider'

// export const Route = createFileRoute('/')({
//   validateSearch: z.object({
//     count: z.number().optional(),
//   }),
//   component: RouteComponent,
// })

export function RouteComponent() {
  return (
    <Stack alignItems="center">
      <section id="hero">
        <h1>Маэстро</h1>
        <h2>История о том, как музыка помогает преодолеть блокаду, болезни и трагедии. Помогите нам рассказать ее миру.</h2>
        <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/4_JVrkIOfBU?si=s9hGz1b4b-umNplq" 
        title="YouTube video player"  
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        >

        </iframe>
        <Button variant="contained">
          ПОДДЕРЖАТЬ ПРОЕКТ
        </Button>
		  </section>
      <section>
        <h2>Партитура одной жизни</h2>
        <p>«Маэстро» – это документальный фильм-портрет о 85-летнем дирижере Германе Колбасникове. Его жизнь, подобно сложной партитуре, соткана из трагедии, стойкости и безграничной преданности музыке. Это гимн человеческому духу, который необходимо сохранить для будущих поколений.</p>
        <VerticalSlider/>
      </section>
    </Stack>
  )
}
