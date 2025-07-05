import { createFileRoute } from '@tanstack/react-router'
import { Chrono, type TimelineItemModel } from 'react-chrono'
import {
  Button,
  Stack,
  Typography,
  Box,
  Grid,
  Modal,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  useMediaQuery,
  useTheme,
  TextField,
  CircularProgress, // НОВОЕ: Индикатор загрузки
  Alert,            // НОВОЕ: Плашка с сообщением о статусе
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { VkIcon } from '~/components/VkIcon';
import TelegramIcon from '@mui/icons-material/Telegram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import GroupsIcon from '@mui/icons-material/Groups';
import ShareIcon from '@mui/icons-material/Share';
import React, { useState, useRef } from 'react'
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

// ======================== ОБНОВЛЕННЫЙ ШЛЮЗ-ЗАГЛУШКА ========================
/**
 * Имитирует асинхронный запрос к платежному шлюзу.
 * @param amount - Сумма платежа в рублях.
 * @param logCallback - Функция обратного вызова для логирования шагов процесса на экране.
 * @returns Promise, который разрешается с объектом успеха или отклоняется с ошибкой.
 */
function mockPaymentGateway(
  amount: number,
  logCallback: (message: string) => void // <--- НОВЫЙ АРГУМЕНТ
): Promise<{ transactionId: string; amount: number }> {
  
  logCallback(`[ШЛЮЗ] Запрос на оплату ${amount} ₽ получен. Отправляем...`);

  return new Promise((resolve, reject) => {
    logCallback('[ШЛЮЗ] Ожидание ответа от банка...');
    
    setTimeout(() => {
      if (Math.random() > 0.2) {
        const transactionId = `mock_trx_${Date.now()}`;
        logCallback(`[ШЛЮЗ] УСПЕХ. Транзакция ${transactionId} одобрена.`);
        resolve({ transactionId, amount });
      } else {
        logCallback('[ШЛЮЗ] ОШИБКА. Банк отклонил операцию.');
        reject(new Error('Не удалось обработать платеж'));
      }
    }, 2000);
  });
}
// ====================================================================

// FIX: Создаем интерфейс для объекта события, чтобы использовать его повторно
interface TimelineEvent {
  year: string
  title: string
  description: string
}

// FIX: Добавляем тип возвращаемого значения для компонента
export function RouteComponent(): React.JSX.Element {
  // Состояния для процесса оплаты
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  
  // НОВОЕ: Состояние для хранения логов, которые будут видны на экране
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Обработчик платежа, который вызывает наш шлюз
  const handlePayment = async (amount: number) => {
    if (amount <= 0) {
      setPaymentStatus({ type: 'error', message: 'Пожалуйста, введите корректную сумму.' });
      return;
    }
    
    setIsLoading(true);
    setPaymentStatus(null);
    setLogMessages([]); // НОВОЕ: Очищаем старые логи перед новым платежом

    // НОВОЕ: Функция-логгер, которую мы передадим в шлюз
    const logOnScreen = (message: string) => {
      // Обновляем состояние, добавляя новое сообщение к предыдущим
      setLogMessages(prevMessages => [...prevMessages, message]);
    };
  
  try {
      // ИЗМЕНЕНО: Передаем logOnScreen как второй аргумент
      const result = await mockPaymentGateway(amount, logOnScreen);
      setPaymentStatus({ type: 'success', message: `Спасибо! Ваш вклад в размере ${result.amount} ₽ успешно получен.` });
    } catch (error) {
      setPaymentStatus({ type: 'error', message: 'Произошла ошибка при оплате. Пожалуйста, попробуйте еще раз.' });
    } finally {
      setIsLoading(false);
    }
  };

  const supportSectionRef = useRef<HTMLElement | null>(null);
  const handleScrollToSupport = () => {
    supportSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // FIX: Четко указываем тип для состояния: это может быть объект события или null
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // FIX: Применяем созданный интерфейс к нашему массиву данных
  const chronoItems: TimelineItemModel[] = [
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

  // Настройки для ДЕСКТОПА (горизонтальный, несколько слайдов)
  const productionSliderSettingsDesktop: Settings = {
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
    ],
  };

  // Настройки для МОБИЛЬНЫХ (вертикальный, один слайд)
  const productionSliderSettingsMobile: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true, // Главное отличие!
    verticalSwiping: true,
  };

  const productionSliderSettings = isMobile 
    ? productionSliderSettingsMobile 
    : productionSliderSettingsDesktop;

  return (
    <Stack alignItems="center" width="100%">
            {/* ======================== СЕКЦИЯ 1: HERO (ИСПРАВЛЕННАЯ) ======================== */}
      <Box
        id="hero"
        component="section"
        // --- ВНЕШНИЙ КОНТЕЙНЕР (ДЛЯ ФОНА) ---
        sx={{
          // Задачи этого блока:
          // 1. Растянуть фон на всю ширину экрана.
          // 2. Отцентрировать внутренний блок с контентом.
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%', // Занимает 100% ширины ОКНА, а не родителя
          backgroundImage: 'url(/assets/photo_2025-07-03_22-11-33.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backgroundBlendMode: 'multiply',
          color: 'white',
        }}
      >
        {/* --- ВНУТРЕННИЙ КОНТЕЙНЕР (ДЛЯ КОНТЕНТА) --- */}
        <Stack
          alignItems="center"
          textAlign="center"
          sx={{
            // Задачи этого блока:
            // 1. Управлять отступами для контента.
            // 2. Ограничить максимальную ширину контента на больших экранах.
            width: '100%',
            maxWidth: 'lg', // Ограничиваем ширину, чтобы текст не был слишком длинным на ПК
            p: { xs: 0, md: 4 }, // А вот и наши отступы! Маленькие на мобильных, большие на ПК.
          }}
        >
          {/* Вся "начинка" теперь живет здесь */}
          <Typography
            variant="h1" // Используем семантически правильный тег h1
            sx={{
              fontFamily: 'Cormorant Garamond', // Явно указываем шрифт
              fontSize: { xs: '5rem', md: '6rem' }, // Адаптивный размер (как пример)
              // Можно использовать и классы Tailwind внутри sx, если настроен twin.macro,
              // но прямой синтаксис надежнее
            }}
          >
            Маэстро
          </Typography>
          <Typography 
            variant="h4" 
            component="h2" 
            maxWidth="md" 
            mt={2} mb={4} 
            sx={{ 
              textShadow: '1px 1px 6px rgba(0,0,0,0.8)',
              fontSize: { xs: '1.2rem', md: '2.125rem' } 
            }}
          >
            История о том, как музыка помогает преодолеть блокаду, болезни и трагедии. Помогите нам рассказать ее миру.
          </Typography>
          <Box sx={{ width: '100%', maxWidth: '720px', aspectRatio: '16 / 9', mb: 4, boxShadow: 8, borderRadius: 2, overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://vk.com/video_ext.php?oid=-38519472&id=456239083&hd=4&autoplay=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              style={{ border: 0 }}
            ></iframe>
          </Box>
          <Button 
            variant="contained" 
            size="large" 
            color="primary"
            onClick={handleScrollToSupport} // <--- ИСПОЛЬЗУЕМ ФУНКЦИЮ
          >
            ПОДДЕРЖАТЬ ПРОЕКТ
          </Button>
        </Stack>
      </Box>

      {/* ======================== СЕКЦИЯ 2: О ФИЛЬМЕ ======================== */}
      <Box 
      component="section"
      sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%', // Занимает 100% ширины ОКНА, а не родителя
        }}
      >
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom mb={4}>
          Партитура одной жизни
        </Typography>
        <Typography variant="body1" fontSize="1.1rem" lineHeight={1.7} textAlign="center">
          «Маэстро» – это документальный фильм-портрет о 85-летнем дирижере Германе Колбасникове. Его жизнь, подобно сложной партитуре, соткана из трагедии, стойкости и безграничной преданности музыке. Это гимн человеческому духу, который необходимо сохранить для будущих поколений.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: '720px', aspectRatio: '16 / 9', mb: 4, boxShadow: 8, borderRadius: 2, overflow: 'hidden' }}>
          <iframe
            width="100%"
            height="100%"
            src="https://vk.com/video_ext.php?oid=-38519472&id=456239088&hd=4&autoplay=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            style={{ border: 0 }}
          ></iframe>
        </Box>
      </Box>

      {/* ======================== СЕКЦИЯ 3: ГЕРОЙ В ЦЕНТРЕ ИСТОРИИ ======================== */}
      <Box component="section" sx={{width: '100%', backgroundColor: '#f5f5f5' }}>
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

      {/* ======================== СЕКЦИЯ 4: ПОДДЕРЖАТЬ ПРОЕКТ (С ВИДИМЫМ ЛОГОМ) ======================== */}
      <Box
        id="support-section"
        ref={supportSectionRef} 
        component="section"
        sx={{ p: { xs: 2, md: 6 }, width: '100%', backgroundColor: '#f0f4f8' }}
      >
        <Stack alignItems="center" spacing={2} maxWidth="1200px" mx="auto">
          {/* ... Заголовки и текст без изменений ... */}
          <Typography variant="h3" component="h2" textAlign="center">
            Станьте частью истории. Поддержите фильм «Маэстро»
          </Typography>
          <Typography textAlign="center" color="text.secondary" maxWidth="lg">
            Мы собрали уникальный материал...
          </Typography>
          
          {/* ... Блок статуса без изменений ... */}
          {paymentStatus && (
            <Alert severity={paymentStatus.type} sx={{ width: '100%', mt: 2 }}>
              {paymentStatus.message}
            </Alert>
          )}

          {/* НОВОЕ: Блок для отображения логов процесса */}
          {logMessages.length > 0 && (
            <Box
              sx={{
                width: '100%',
                bgcolor: 'grey.900',
                color: 'common.white',
                fontFamily: 'monospace',
                p: 2,
                borderRadius: 1,
                mt: 2,
                maxHeight: '150px',
                overflowY: 'auto', // Добавляем скролл, если логов много
              }}
            >
              {logMessages.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </Box>
          )}

          <Grid container spacing={5} mt={0}>
            {/* ... Остальной код Grid, кнопок и полей ввода остается без изменений ... */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Typography variant="h5" component="h3">Внести донат</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="outlined" size="large" onClick={() => handlePayment(500)} disabled={isLoading}>500 ₽ (на оцифровку архивов)</Button>
                  <Button variant="outlined" size="large" onClick={() => handlePayment(1500)} disabled={isLoading}>1500 ₽ (на аренду оборудования)</Button>
                  <Button variant="outlined" size="large" onClick={() => handlePayment(5000)} disabled={isLoading}>5000 ₽ (на съемочный день)</Button>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField 
                    label="Другая сумма" 
                    variant="outlined" 
                    type="number" 
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => handlePayment(Number(customAmount))} 
                    disabled={isLoading}
                    sx={{ position: 'relative' }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Пожертвовать'}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            
            {/* ... Правая колонка без изменений ... */}
            <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom>Стать спонсором</Typography>
                  <Typography variant="body2" mb={1}>Предлагаем пакеты для партнеров...</Typography>
                  <Button variant="contained" color="secondary" href="mailto:maestro.film.sponsor@email.com">Связаться с продюсером</Button>
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom>Помочь информационно</Typography>
                  <Typography variant="body2" mb={1}>Лучшая помощь — рассказать о нашем проекте...</Typography>
                  <Button variant="contained" color="secondary">Поделиться</Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Box>

      {/* ======================== СЕКЦИЯ 5: КОМАНДА ======================== */}
      <Box component="section" sx={{ maxWidth: '1200px' }}>
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
            ].map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.name}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar
                    alt={member.name}
                    src={member.img}
                    sx={{
                      // Делаем аватар большим и адаптивным
                      width: { xs: 140, md: 160 },
                      height: { xs: 140, md: 160 },
                      // Добавим небольшую тень для объема
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: '3px solid white'
                    }}
                  />
                  <Box textAlign="center">
                    <Typography variant="h6" component="div">
                      {member.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {member.role}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
      
      {/* ======================== СЕКЦИЯ 6: ПРОИЗВОДСТВО ======================== */}
      <Box component="section" sx={{width: '100%', backgroundColor: '#f5f5f5' }}>
        <Stack alignItems="center" spacing={4} maxWidth="1200px" mx="auto">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Загляните за кулисы
          </Typography>
          
          {/* FIX 4: Добавляем Box-обертку со стилями для точек на мобильных */}
          <Box sx={{
            width: '100%',
            p: 2,
            // Стили применяются ТОЛЬКО на мобильных
            ...(isMobile && {
              // Для вертикального слайдера нужно переопределить позицию точек
              '.slick-dots': {
                position: 'relative', // Убираем 'absolute'
                bottom: 'auto', // Сбрасываем позиционирование снизу
                marginTop: '16px', // Добавляем отступ сверху
              },
              '.slick-dots li': {
                display: 'inline-block', // Выстраиваем точки в ряд
                margin: '0 5px',
              },
              // Ограничиваем высоту слайдера, чтобы он не уезжал за экран
              '.slick-slider': {
                maxHeight: '450px',
              }
            })
          }}>
            {/* Используем выбранный объект настроек */}
            <Slider {...productionSliderSettings}>
              {[
                { title: 'Съёмки в ЛОККиИ', img: 'https://picsum.photos/seed/prod1/600/400' },
                { title: 'Съёмки в Феодоровском соборе', img: 'https://picsum.photos/seed/prod2/600/400' },
                { title: 'Съёмки в Музыкальной школе', img: 'https://picsum.photos/seed/prod3/600/400' },
                { title: 'Интервью с Маэстро', img: 'https://picsum.photos/seed/prod4/600/400' },
                { title: 'Работа с архивами', img: 'https://picsum.photos/seed/prod5/600/400' },
              ].map((shot, index) => (
                <Box key={index} sx={{ px: 0, py: 1 }}>
                  <Card sx={{ mx: { xs: 0, sm: 1} }}>
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
              <IconButton color="primary" href="#" aria-label="ВКонтакте"><VkIcon fontSize='large' /></IconButton>
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
         mt: 'auto',
         backgroundColor: (theme) =>
           theme.palette.mode === 'light'
             ? theme.palette.grey[800]
             : theme.palette.grey[900],
         color: 'white',
         textAlign: 'center'
      }}>
         <Typography variant="body2">
           © 2025, Документальный фильм «Маэстро». Все права защищены.
         </Typography>
          <Typography variant="body2">
           Политика конфиденциальности.
         </Typography>
      </Box>
    </Stack>
  )
}