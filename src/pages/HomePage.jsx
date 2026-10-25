import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './HomePage.css';
import Carousel from '../components/Carousel';
import Tariffs from '../components/Tariffs/Tariffs';

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <main className="page-wrapper">
      <section className="main-about">
        <div className="main-about_text">
          <h1>
            Сервис по поиску публикаций о компании
            <br />
            по его ИНН
          </h1>
          <p>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
          <button className="main-about_button" onClick={() => {
            if (isLoggedIn) {navigate('/search');}
            else {navigate('/');}
            }}
            >
            Запросить данные
          </button>
        </div>

        <div className="main-about_img">
          <img src="./About.svg" alt="About illustration" />
          <img className="main-about_plug" src="./Plug.svg" alt="Plug illustration" />
        </div>
      </section>
      <section className="carousel">
      <h2>Почему именно мы</h2>
      <Carousel />
      </section>
      <Tariffs
        isAuthenticated={isLoggedIn}
        currentTariffId={null}
      />
    </main>
  );
}
