import Carousel from "../components/Carousel";
import banner1 from "../images/Banner1.png";
import banner2 from "../images/Banner2.png";

export function AboutUs() {
  return (
    <div>
      <h1>Về chúng tôi</h1>
      <Carousel bannerImages={[banner1, banner2]} />
      <h2>
        Chào mừng bạn đến với PerfectSmile Dental tại Thành phố Hồ Chí Minh!
      </h2>
      <p>
        Chúng tôi tự hào là địa chỉ nha khoa hàng đầu, cam kết mang lại dịch vụ
        chăm sóc nha khoa chất lượng nhất để đảm bảo sức khỏe nướu và răng của
        bạn. Với đội ngũ bác sĩ chuyên nghiệp, trang thiết bị hiện đại và một
        môi trường chăm sóc thân thiện, chúng tôi cam kết mang lại trải nghiệm
        chăm sóc nha khoa tốt nhất cho mọi bệnh nhân.
      </p>
      <h2>Sứ mệnh của chúng tôi</h2>
      <p>
        Tại PerfectSmile Dental, sứ mệnh chúng tôi là cung cấp dịch vụ nha khoa
        chất lượng cao, đồng thời tạo ra một môi trường thoải mái và an toàn cho
        mọi bệnh nhân. Chúng tôi cam kết:
      </p>
      <ul>
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
      <h2>Đội ngũ bác sĩ</h2>
      <p>
        Đội ngũ bác sĩ của chúng tôi được đào tạo chuyên sâu và có nhiều năm
        kinh nghiệm trong lĩnh vực nha khoa. Chúng tôi cam kết mang lại trải
        nghiệm chăm sóc nha khoa tốt nhất cho mọi bệnh nhân.
      </p>
      <h2>Trang thiết bị</h2>
      <p>
        Chúng tôi luôn đầu tư vào các thiết bị hiện đại nhất để đảm bảo mọi bệnh
        nhân đều nhận được dịch vụ tốt nhất.
      </p>
      <h2>Liên hệ với chúng tôi</h2>
      <p>
        Chúng tôi luôn sẵn lòng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy
        liên hệ với chúng tôi để đặt hẹn hoặc biết thêm thông tin về dịch vụ của
        chúng tôi. PerfectSmile Dental tự tin sẽ mang lại cho bạn một nụ cười
        khỏe mạnh và tự tin.
        <br />
        Cảm ơn bạn đã tin tưởng và chọn lựa PerfectSmile Dental!
        <br />
        Địa chỉ: 227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh
        <br />
        Điện thoại: 028 3838 8388
      </p>
    </div>
  );
}
