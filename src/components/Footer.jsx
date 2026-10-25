import './Footer.css';

export default function Footer() {
    return (
      <footer className="footer">
          <div className="footer_content">
              <div className="footer_logo">
              <img src="/Logo_footer.svg" alt="СКАН" />
              </div>

              <div className="footer_info">
                  <address className="footer_address">
                      <span>г. Москва, Цветной б-р, 40</span>
                      <a href="tel:+74957712111">+7 495 771 21 11</a>
                      <a href="mailto:info@skan.ru">info@skan.ru</a>
                  </address>

                  <p className="footer_copyright">Copyright. 2022</p>
              </div>
          </div>
      </footer>
    );
}