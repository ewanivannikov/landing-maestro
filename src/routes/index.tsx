import { createFileRoute } from '@tanstack/react-router'
import { Chrono } from 'react-chrono'
import {
  Button,
  Stack,
  Typography,
  Box,
  Grid,
  Modal,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TelegramIcon from '@mui/icons-material/Telegram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import z from 'zod'
import React, { useState } from 'react'
// FIX: Импортируем тип Settings для настроек слайдера
import Slider, { Settings } from 'react-slick'

// Импорт стилей для react-slick
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// export const Route = createFileRoute('/')({
//   validateSearch: z.object({
//     count: z.number().optional(),
//   }),
//   component: RouteComponent,
// })

// FIX: Создаем интерфейс для объекта события, чтобы использовать его повторно
interface TimelineEvent {
  year: string
  title: string
  description: string
}

// FIX: Добавляем тип возвращаемого значения для компонента
export function RouteComponent(): React.JSX.Element {
  // FIX: Четко указываем тип для состояния: это может быть объект события или null
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // FIX: Применяем созданный интерфейс к нашему массиву данных
  const chronoItems = [
  {
    // Поле 'year' из ваших данных стало 'title' - оно отображается на самой шкале времени.
    title: '~1942',
    // Поле 'title' из ваших данных стало 'cardTitle' - это заголовок на карточке.
    cardTitle: 'Ужасы блокады и эвакуация',
    // Поле 'description' стало 'cardDetailedText' - это основной текст на карточке.
    cardDetailedText: 'Пережитые в детстве ужасы блокады Ленинграда и последующая эвакуация оставили неизгладимый след в душе будущего маэстро.',
    // Для каждого события добавлено изображение-плейсхолдер.
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-1/400/300',
      },
    },
  },
  {
    title: '~1955',
    cardTitle: 'Расставание с музыкой',
    cardDetailedText: 'Тяжелая болезнь (туберкулез) заставила Германа Давыдовича уйти из музыкальной школы, казалось, навсегда распрощавшись с мечтой.',
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-2/400/300',
      },
    },
  },
  {
    title: '~1963',
    cardTitle: 'Начало пути педагога',
    cardDetailedText: 'Несмотря на все трудности, Колбасников начинает преподавательскую деятельность в Пензе, находя свое призвание в обучении других.',
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-3/400/300',
      },
    },
  },
  {
    title: '1966',
    cardTitle: 'Возвращение в Ленинград',
    cardDetailedText: 'Возвращение в родной город ознаменовало новый этап в карьере — начало многолетней работы в Ленинградском областном колледже культуры и искусства (ЛОККИИ).',
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-4/400/300',
      },
    },
  },
  {
    title: '1985',
    cardTitle: 'Создание хора ветеранов',
    cardDetailedText: 'Герман Давыдович создает уникальный для своего времени хор ветеранов, даря пожилым людям возможность творческой реализации.',
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-5/400/300',
      },
    },
  },
  {
    title: '1994',
    cardTitle: 'Рождение "Альма Матер"',
    cardDetailedText: 'По горячей просьбе выпускников рождается хор «Альма Матер», который станет делом всей его жизни и прославится на европейских сценах.',
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-6/400/300',
      },
    },
  },
  {
    title: '2002',
    cardTitle: 'Мистическое исцеление',
    cardDetailedText: 'Тяжелейшая травма позвоночника приковала Маэстро к постели, но благодаря невероятной силе воли и поддержке близких он смог вернуться к дирижерскому пульту.',
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-7/400/300',
      },
    },
  },
  {
    title: 'Сегодня',
    cardTitle: 'Живая легенда',
    cardDetailedText: 'Герман Колбасников — живая легенда, чье наследие продолжает жить в хоре «Альма Матер» и в сотнях его учеников по всему миру.',
    media: {
      type: 'IMAGE',
      source: {
        url: 'https://picsum.photos/seed/maestro-timeline-8/400/300',
      },
    },
  },
];

  // FIX: Типизируем входящий аргумент 'event'
  const handleOpenModal = (event: TimelineEvent) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedEvent(null)
  }

  // --- Настройки для слайдеров ---
  // FIX: Добавляем тип Settings для объекта с настройками
  const verticalSliderSettings: Settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    arrows: false,
    autoplay: true,
    speed: 1000,
  }

  // FIX: Добавляем тип Settings для объекта с настройками
  const teamSliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }


  return (
    <Stack alignItems="center" width="100%">
      {/* ======================== СЕКЦИЯ 1: HERO ======================== */}
      <Box
        id="hero"
        component="section"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          backgroundImage: 'url(https://picsum.photos/seed/maestro-hero/1920/1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backgroundBlendMode: 'multiply',
          color: 'white',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h1" component="h1" fontWeight="bold" sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)', fontSize: {xs: '3rem', md: '6rem'} }}>
          Маэстро
        </Typography>
        <Typography variant="h4" component="h2" maxWidth="md" mt={2} mb={4} sx={{ textShadow: '1px 1px 6px rgba(0,0,0,0.8)', fontSize: {xs: '1.2rem', md: '2.125rem'} }}>
          История о том, как музыка помогает преодолеть блокаду, болезни и трагедии. Помогите нам рассказать ее миру.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: '720px', aspectRatio: '16 / 9', mb: 4, boxShadow: 8, borderRadius: 2, overflow: 'hidden' }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/4_JVrkIOfBU?si=s9hGz1b4b-umNplq"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            style={{ border: 0 }}
          ></iframe>
        </Box>
        {/* Примечание: Кнопка пока не ведет к Секции 4, т.к. она пропущена по ТЗ. */}
        <Button variant="contained" size="large" color="primary">
          ПОДДЕРЖАТЬ ПРОЕКТ
        </Button>
      </Box>

      {/* ======================== СЕКЦИЯ 2: О ФИЛЬМЕ ======================== */}
      <Box component="section" sx={{ p: { xs: 2, md: 6 }, maxWidth: '1200px' }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom mb={4}>
          Партитура одной жизни
        </Typography>
        <Grid container spacing={4} alignItems="center" >
          <Typography variant="body1" fontSize="1.1rem" lineHeight={1.7} textAlign="center">
            «Маэстро» – это документальный фильм-портрет о 85-летнем дирижере Германе Колбасникове. Его жизнь, подобно сложной партитуре, соткана из трагедии, стойкости и безграничной преданности музыке. Это гимн человеческому духу, который необходимо сохранить для будущих поколений.
          </Typography>
          {/* <Grid item xs={12} md={6}>
             <Box sx={{ height: '400px', p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Slider {...verticalSliderSettings}>
                <div><img src="https://picsum.photos/seed/archive1/400/400" alt="Архивное фото 1" style={{ width: '100%', objectFit: 'cover' }} /></div>
                <div><img src="https://picsum.photos/seed/archive2/400/400" alt="Архивное фото 2" style={{ width: '100%', objectFit: 'cover' }} /></div>
                <div><img src="https://picsum.photos/seed/archive3/400/400" alt="Архивное фото 3" style={{ width: '100%', objectFit: 'cover' }} /></div>
              </Slider>
            </Box>
          </Grid> */}
        </Grid>
      </Box>

      {/* ======================== СЕКЦИЯ 3: ГЕРОЙ В ЦЕНТРЕ ИСТОРИИ ======================== */}
      <Box component="section" sx={{ p: { xs: 2, md: 6 }, width: '100%', backgroundColor: '#f5f5f5' }}>
        <Stack alignItems="center" spacing={4} maxWidth="1200px" mx="auto">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Путь Маэстро: от блокады до европейских сцен
          </Typography>
          <div>
            <Chrono
            disableToolbar={true}
            enableQuickJump={false}
            useReadMore={false}
            scrollable={{ scrollbar: true }}
            items={chronoItems}
            mode={isMobile ? 'VERTICAL' : 'HORIZONTAL'}
            />
          </div>
          {/* <Typography textAlign="center" color="text.secondary" mb={4}>
            Нажмите на событие, чтобы узнать больше.
          </Typography> */}
          {/* <Grid container spacing={2} justifyContent="center">
            {timelineEvents.map((event, index) => (
              <Grid item key={index}>
                <Button variant="outlined" onClick={() => handleOpenModal(event)}>
                  {event.year}
                </Button>
              </Grid>
            ))}
          </Grid> */}
        </Stack>
      </Box>

      {/* Модальное окно для Секции 3 */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400, md: 500 },
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          {selectedEvent && (
            <>
              <Typography variant="h5" component="h3" gutterBottom>
                {selectedEvent.year}: {selectedEvent.title}
              </Typography>
              <Typography sx={{ mt: 2 }}>{selectedEvent.description}</Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* ======================== СЕКЦИЯ 5: КОМАНДА ======================== */}
      <Box component="section" sx={{ p: { xs: 2, md: 6 }, maxWidth: '1200px' }}>
        <Stack alignItems="center" spacing={4}>
           <Typography variant="h3" component="h2" textAlign="center">
            О команде
          </Typography>
           <Typography textAlign="center" maxWidth="lg">
            Над фильмом работает команда профессионалов, влюбленных в документальное кино и историю Маэстро. Режиссер фильма — Евгений Иванников, известный своими глубокими и трогательными киноработами.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { name: 'Евгений Иванников', role: 'Режиссер', img: 'https://picsum.photos/seed/team1/300/300' },
              { name: 'Иван Петров', role: 'Оператор-постановщик', img: 'https://picsum.photos/seed/team2/300/300' },
              { name: 'Анна Сидорова', role: 'Продюсер', img: 'https://picsum.photos/seed/team3/300/300' },
              { name: 'Алексей Смирнов', role: 'Звукорежиссер', img: 'https://picsum.photos/seed/team4/300/300' },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardMedia component="img" height="250" image={member.img} alt={member.name} />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
      
      {/* ======================== СЕКЦИЯ 6: ПРОИЗВОДСТВО ======================== */}
      <Box component="section" sx={{ p: { xs: 2, md: 6 }, width: '100%', backgroundColor: '#f5f5f5' }}>
        <Stack alignItems="center" spacing={4} maxWidth="1200px" mx="auto">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Загляните за кулисы
          </Typography>
          <Box sx={{ width: '100%', p: 2 }}>
            <Slider {...teamSliderSettings}>
              {[
                { title: 'Съёмки в ЛОККиИ', img: 'https://picsum.photos/seed/prod1/600/400' },
                { title: 'Съёмки в Феодоровском соборе', img: 'https://picsum.photos/seed/prod2/600/400' },
                { title: 'Съёмки в Музыкальной школе', img: 'https://picsum.photos/seed/prod3/600/400' },
                { title: 'Интервью с Маэстро', img: 'https://picsum.photos/seed/prod4/600/400' },
                { title: 'Работа с архивами', img: 'https://picsum.photos/seed/prod5/600/400' },
              ].map((shot, index) => (
                <Box key={index} sx={{ p: 2 }}>
                  <Card>
                     <CardMedia component="img" height="250" image={shot.img} alt={shot.title} />
                     <CardContent>
                        <Typography variant="h6" component="div" textAlign="center">
                          {shot.title}
                        </Typography>
                     </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>
        </Stack>
      </Box>

      {/* ======================== СЕКЦИЯ 7: КОНТАКТЫ И ФУТЕР ======================== */}
      <Box component="section" sx={{ p: { xs: 2, md: 6 }, maxWidth: '1200px' }}>
         <Stack alignItems="center" spacing={3}>
            <Typography variant="h4" component="h2">Следите за новостями</Typography>
            <Stack direction="row" spacing={2}>
              <IconButton color="primary" href="#" aria-label="ВКонтакте"><LinkedInIcon fontSize='large' /></IconButton>
              <IconButton color="primary" href="#" aria-label="Telegram"><TelegramIcon fontSize='large'/></IconButton>
              <IconButton color="primary" href="#" aria-label="YouTube"><YouTubeIcon fontSize='large'/></IconButton>
            </Stack>
            <Typography variant="h6">Контакты</Typography>
            <Typography>Для общих вопросов: <a href="mailto:info@maestro-film.ru">info@maestro-film.ru</a></Typography>
            <Typography>Для прессы и спонсоров: <a href="mailto:pr@maestro-film.ru">pr@maestro-film.ru</a></Typography>
         </Stack>
      </Box>

      {/* Футер */}
      <Box component="footer" sx={{
         width: '100%',
         py: 3,
         px: 2,
         mt: 'auto',
         backgroundColor: (theme) =>
           theme.palette.mode === 'light'
             ? theme.palette.grey[800]
             : theme.palette.grey[900],
         color: 'white',
         textAlign: 'center'
      }}>
         <Typography variant="body2">
           © 2024, Документальный фильм «Маэстро». Все права защищены.
         </Typography>
          <Typography variant="body2">
           Политика конфиденциальности.
         </Typography>
      </Box>
    </Stack>
  )
}