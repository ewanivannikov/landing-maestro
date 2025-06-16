import { createFileRoute } from '@tanstack/react-router'
import { Button, Stack, Typography } from '@mui/material'
import z from 'zod'
import { Counter } from '~/components/Counter'
import {VerticalSlider} from '~/components/VerticalSlider/VerticalSlider'

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    count: z.number().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack alignItems="center">
      <section id="hero">
        <h1>Маэстро</h1>
        <h2>История о том, как музыка помогает преодолеть блокаду, болезни и трагедии. Помогите нам рассказать ее миру.</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/4_JVrkIOfBU?si=s9hGz1b4b-umNplq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
