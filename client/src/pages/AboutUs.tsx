import Carousel from "../components/Carousel";
import banner1 from "../images/Banner1.png";
import banner2 from "../images/Banner2.png";
import Reveal from "./AboutUsReveal";

export function AboutUs() {
  const containerStyle = {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  };

  const divStyle = {
    marginBottom: '30px',
  };

  const headingStyle = {
    color: '#34C38F',
    marginTop: '10px',
  };

  const paragraphStyle = {
    margin: '15px 0',
    lineHeight: '25px',
  };

  const listStyle = {
    listStyleType: 'disc',
    marginLeft: '30px',
  };

  // Responsive styles
  const responsiveStyles = {
    maxWidth: '100%',
    padding: '10px',
  };

  return (
    <div style={{ ...containerStyle, ...responsiveStyles }}>
      <Carousel bannerImages={[banner1, banner2]} />
      <div style={divStyle}>
        <Reveal>
          <h1 style={headingStyle}>
            Chào mừng bạn đến với PerfectSmile Dental Thành phố Hồ Chí Minh!
          </h1>
        </Reveal>
        <Reveal>
        <p style={{ ...paragraphStyle, fontSize: '1.2em' }}>
          Chúng tôi tự hào là địa chỉ nha khoa hàng đầu, cam kết mang lại dịch vụ
          chăm sóc nha khoa chất lượng nhất để đảm bảo sức khỏe nướu và răng của
          bạn. Với đội ngũ bác sĩ chuyên nghiệp, trang thiết bị hiện đại và một
          môi trường chăm sóc thân thiện, chúng tôi cam kết mang lại trải nghiệm
          chăm sóc nha khoa tốt nhất cho mọi bệnh nhân.
        </p>
        </Reveal>
      </div>
      <div style={divStyle}>
        <Reveal>
        <h2 style={headingStyle}>Sứ mệnh của chúng tôi</h2>
        </Reveal>
        <Reveal>
        <p style={{ ...paragraphStyle, fontSize: '1.2em' }}>
          Tại PerfectSmile Dental, sứ mệnh chúng tôi là cung cấp dịch vụ nha khoa
          chất lượng cao, đồng thời tạo ra một môi trường thoải mái và an toàn cho
          mọi bệnh nhân. Chúng tôi cam kết:
        </p>
        </Reveal>
        <Reveal>
        <ul style={listStyle}>
          <li>
            <strong>Chất lượng Chăm sóc Nha Khoa:</strong> Với đội ngũ bác sĩ có
            kinh nghiệm và được đào tạo chuyên sâu, chúng tôi đảm bảo mọi bệnh
            nhân đều nhận được sự chăm sóc tận tâm và chuyên nghiệp.
          </li>
          <li>
            <strong>Trang thiết bị hiện đại:</strong> Chúng tôi luôn đầu tư vào
            các thiết bị hiện đại nhất để đảm bảo mọi bệnh nhân đều nhận được dịch
            vụ tốt nhất.
          </li>
          <li>
            <strong>Môi trường chăm sóc thân thiện:</strong> Chúng tôi cam kết tạo
            ra một môi trường chăm sóc thân thiện, thoải mái và an toàn cho mọi
            bệnh nhân.
          </li>
        </ul>
        </Reveal>
      </div>
      <div style={divStyle}>
        <Reveal>
          <h2 style={headingStyle}>Đội ngũ bác sĩ</h2>
        </Reveal>
        <Reveal>
          <p style={{ ...paragraphStyle, fontSize: '1.2em' }}>
            Đội ngũ bác sĩ của chúng tôi được đào tạo chuyên sâu và có nhiều năm
            kinh nghiệm trong lĩnh vực nha khoa. Chúng tôi cam kết mang lại trải
            nghiệm chăm sóc nha khoa tốt nhất cho mọi bệnh nhân.
          </p>
        </Reveal>
      </div>
      <div style={divStyle}>
        <Reveal>
        <h2 style={headingStyle}>Trang thiết bị</h2>
        </Reveal>
        <Reveal>
        <p style={{ ...paragraphStyle, fontSize: '1.2em' }}>
          Chúng tôi luôn đầu tư vào các thiết bị hiện đại nhất để đảm bảo mọi bệnh
          nhân đều nhận được dịch vụ tốt nhất.
        </p >
        </Reveal>
      </div>
      <div style={divStyle}>
        <Reveal>
        <h2 style={headingStyle}>Liên hệ với chúng tôi</h2>
        </Reveal>
        <Reveal>
        <p style={{ ...paragraphStyle, fontSize: '1.2em' }}>
          Chúng tôi luôn sẵn lòng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy
          liên hệ với chúng tôi để đặt hẹn hoặc biết thêm thông tin về dịch vụ của
          chúng tôi. <br />
          PerfectSmile Dental tự tin sẽ mang lại cho bạn một nụ cười
          khỏe mạnh và tự tin.
          <br />
          Cảm ơn bạn đã tin tưởng và chọn lựa PerfectSmile Dental!
          <br />
          Địa chỉ: 227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh
          <br />
          Điện thoại: 028 3838 8388
        </p>
        </Reveal>
      </div>
    </div>
  );
}
