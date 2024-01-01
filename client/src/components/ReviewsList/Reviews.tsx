// import { styles } from "@/app/styles/style";
// import Image from "next/image";
import React from "react";
import ReviewCard from "./ReviewCard/ReviewCard";

const styles = {
    title: "text-[25px] text-black dark:text-white font-[500] font-Poppins text-center py-2",
    label:"text-[16px] font-Poppins text-black dark:text-white",
    input:"w-full text-black dark:text-white bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins",
    button:"flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] w-full text-[16px] font-Poppins font-semibold"
}

type Props = {};

export const reviews = [
  {
    name: "Nguyễn Thị Lan",
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    profession: "Giáo viên | Trường THCS Nguyễn Du",
    comment:
    "Tôi rất hài lòng với dịch vụ của Nha khoa PefectSmile Dental. Tôi đã cấy ghép implant toàn hàm và cảm thấy rất thoải mái và tự tin khi cười. Bác sĩ rất chuyên nghiệp và tận tình, phòng khám rất sạch sẽ và hiện đại. Tôi sẽ giới thiệu cho bạn bè và người thân của tôi về Nha khoa Trồng Răng Sài Gòn.",
},
  {
    name: "Trần Văn Minh",
    avatar: "https://randomuser.me/api/portraits/men/19.jpg",
    profession: "Kỹ sư | Công ty TNHH ABC",
    comment:
    "Cảm ơn Nha khoa PefectSmile Dental đã giúp tôi có được hàm răng đẹp và khỏe mạnh. Tôi đã dán sứ veneer cho 8 răng trên và rất hài lòng với kết quả. Răng của tôi trở nên trắng sáng và đều đặn, không còn bị mài mòn hay ố vàng. Bác sĩ rất tài năng và thân thiện, phòng khám rất sang trọng và tiện nghi. Tôi sẽ tiếp tục đến Nha khoa Premier Dental để chăm sóc răng miệng của tôi.",
},
  {
    name: "Lê Thị Hồng",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    profession: "Nhân viên văn phòng | Ngân hàng TMCP XYZ",
    comment:
    "Tôi rất ấn tượng với dịch vụ niềng răng của Nha khoa PefectSmile Dental. Tôi đã niềng răng chỉnh nha bằng công nghệ kỹ thuật số 4.0 và chỉ mất 5 tháng để có được hàm răng đều đẹp. Bác sĩ rất nhiệt tình và chuyên môn cao, phòng khám rất hiện đại và thoáng mát. Tôi sẽ giới thiệu cho mọi người về Nha khoa 2000.",
},
  {
    name: "Phạm Quang Huy",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    profession: "Sinh viên | Đại học Bách Khoa",
    comment:
    "Tôi rất hài lòng với dịch vụ nhổ răng khôn của Nha khoa PefectSmile Dental. Tôi đã nhổ 2 răng khôn bị mọc lệch và gây đau nhức. Quá trình nhổ răng rất nhanh chóng và không đau, bác sĩ rất kỹ lưỡng và vui vẻ. Phòng khám rất sạch sẽ và có nhiều trang thiết bị hiện đại. Tôi sẽ tiếp tục đến Nha khoa Xô Viết để chăm sóc răng miệng của tôi.",
},
  {
    name: "Nguyễn Thị Thanh",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    profession: "Nội trợ | Quận 7",
    comment:
    "Tôi rất yêu thích dịch vụ bọc răng sứ của Nha khoa PefectSmile Dental. Tôi đã bọc răng sứ cho 6 răng trên và rất hài lòng với kết quả. Răng của tôi trở nên trắng sáng và chắc khỏe, không còn bị sâu hay nứt. Bác sĩ rất giỏi và tận tâm, phòng khám rất đẹp và ấm cúng. Tôi sẽ giới thiệu cho bạn bè và người thân của tôi về Nha khoa Tâm Anh.",
},
  {
    name: "Đỗ Thị Mai",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    profession: "Bác sĩ | Bệnh viện Đa khoa Quốc tế",
    comment:
    "Tôi rất cảm ơn Nha khoa PefectSmile Dental đã giúp tôi có được nụ cười đẹp và tự tin. Tôi đã cắt lợi thẩm mỹ và rất hài lòng với kết quả. Lợi của tôi trở nên hồng hào và đều màu, không còn bị hở lợi khi cười. Bác sĩ rất chuyên nghiệp và tận tình, phòng khám rất sang trọng và thoải mái. Tôi sẽ tiếp tục đến Nha khoa Assure Dental Clinic để chăm sóc răng miệng của tôi.",
},
];


const Reviews = (props: Props) => {
  return (
  <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
      <div className="800px:w-[50%] w-full">
        {/* <Image
        src={require("../../../public/assests/business-img.png")}
        alt="business"
        width={700}
        height={700}
        /> */}
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Đánh Giá  <span className="text-gradient">Phòng Khám Nha Sĩ</span>{" "}
            <br /> Xem Họ Nhận xét chúng ta như thế nào?
          </h3>
          <br />
          {/* <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque unde
            voluptatum dignissimos, nulla perferendis dolorem voluptate nemo
            possimus magni deleniti natus accusamus officiis quasi nihil
            commodi, praesentium quidem, quis doloribus?
          </p> */}
        </div>
        <br />
        <br />
       </div>
       <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-20px]">
        {reviews &&
            reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
        </div>
  </div>
  );
};

export default Reviews;
