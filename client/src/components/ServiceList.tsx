// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Box, Container, Grid, Typography, Card, CardContent, CardMedia, Chip } from '@mui/material';
// import { green } from '@mui/material/colors';

// // Tạo interface cho dịch vụ
// interface IService {
//   MaDV: string;
//   TenDV: string;
//   MoTa: string;
//   DongGia: number;
// }

// // Tạo component ServiceCard để hiển thị thông tin của một dịch vụ
// const ServiceCard = ({ service }: { service: IService }) => {
//   const keywords = ['dentist', 'teeth', 'toothbrush', 'smile', 'braces', 'implant', 'whitening', 'cavity', 'floss', 'oral'];
//   const getRandomKeywords = (n: number) => {
//     // Tạo một mảng để lưu trữ các từ khóa ngẫu nhiên
//     const randomKeywords = [];
//     // Lặp n lần
//     for (let i = 0; i < n; i++) {
//       // Chọn một từ khóa ngẫu nhiên từ danh sách
//       const randomIndex = Math.floor(Math.random() * keywords.length);
//       const randomKeyword = keywords[randomIndex];
//       // Thêm từ khóa vào mảng
//       randomKeywords.push(randomKeyword);
//     }
//     // Trả về một chuỗi nối các từ khóa bằng dấu phẩy
//     return randomKeywords.join(',');
//   };
  
//   return (
//     <Card sx={{ maxWidth: 345, margin: 2 }}>
//       <CardMedia
//         component="img"
//         height="140"
//         image={`https://source.unsplash.com/300x200/?${getRandomKeywords(3)}`} // Tạo ảnh ngẫu nhiên với 3 từ khóa liên quan đến nha sĩ
//         alt={service.TenDV}
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           {service.TenDV}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {service.MoTa}
//         </Typography>
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
//           <Chip label={`${service.DongGia.toLocaleString()} VND`} color="success" />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// // Tạo component ServiceList để hiển thị danh sách các dịch vụ
// const ServiceList = () => {
//   // Tạo state để lưu trữ danh sách các dịch vụ
//   const [services, setServices] = useState<IService[]>([]);

//   // Sử dụng useEffect để gọi api khi component được mount
//   useEffect(() => {
//     // Tạo hàm async để gọi api
//     const fetchServices = async () => {
//       try {
//         // Gọi api bằng axios có withCredential
//         const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-all-services`, { withCredentials: true });
//         // Nếu thành công, cập nhật state bằng dữ liệu trả về
//         if (response.data.success) {
//           setServices(response.data.services);
//         }
//       } catch (error) {
//         // Nếu có lỗi, hiển thị lỗi ra console
//         console.error(error);
//       }
//     };
//     // Gọi hàm async
//     fetchServices();
//   }, []); // Chỉ gọi api một lần khi component được mount

//   // Trả về jsx để hiển thị danh sách các dịch vụ
//   return (
//     <Box sx={{ bgcolor: green[50], minHeight: '100vh' }}>
//         <Container sx={{ marginTop: 4 }}>
//         <Typography variant="h4" align="center" gutterBottom>
//             Danh sách các dịch vụ nha khoa
//         </Typography>
//         <Grid container spacing={2}>
//             {services.map((service) => (
//             <Grid item xs={12} sm={6} md={4} key={service.MaDV}>
//                 <ServiceCard service={service} />
//             </Grid>
//             ))}
//         </Grid>
//         </Container>
//     </Box>
//   );
// };

// export default ServiceList

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Grid, Image, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Tạo interface cho dịch vụ
interface IService {
  MaDV: string;
  TenDV: string;
  MoTa: string;
  DongGia: number;
}

// Tạo component ServiceCard để hiển thị thông tin của một dịch vụ
const ServiceCard = ({ service }: { service: IService }) => {
  const keywords = ['dentist', 'teeth', 'toothbrush', 'smile', 'braces', 'implant', 'whitening', 'cavity', 'floss', 'oral'];
  const getRandomKeywords = (n: number) => {
    // Tạo một mảng để lưu trữ các từ khóa ngẫu nhiên
    const randomKeywords = [];
    // Lặp n lần
    for (let i = 0; i < n; i++) {
      // Chọn một từ khóa ngẫu nhiên từ danh sách
      const randomIndex = Math.floor(Math.random() * keywords.length);
      const randomKeyword = keywords[randomIndex];
      // Thêm từ khóa vào mảng
      randomKeywords.push(randomKeyword);
    }
    // Trả về một chuỗi nối các từ khóa bằng dấu phẩy
    return randomKeywords.join(',');
  };

  return (
    <Card style={{ maxWidth: 345, margin: 10, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }} className="card-hover">
      <Image
        src={`https://source.unsplash.com/300x200/?${getRandomKeywords(3)}`} // Tạo ảnh ngẫu nhiên với 3 từ khóa liên quan đến nha sĩ
        alt={service.TenDV}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{service.TenDV}</Card.Header>
        <Card.Description>{service.MoTa}</Card.Description>
      </Card.Content>
      <Card.Content extra style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Label color="green" tag>
          {service.DongGia.toLocaleString()} VND
        </Label>
      </Card.Content>
    </Card>
  );
};

// Tạo component ServiceList để hiển thị danh sách các dịch vụ
const ServiceList = () => {
  // Tạo state để lưu trữ danh sách các dịch vụ
  const [services, setServices] = useState<IService[]>([]);

  // Sử dụng useEffect để gọi api khi component được mount
  useEffect(() => {
    // Tạo hàm async để gọi api
    const fetchServices = async () => {
      try {
        // Gọi api bằng axios có withCredential
        const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-all-services`, { withCredentials: true });
        // Nếu thành công, cập nhật state bằng dữ liệu trả về
        if (response.data.success) {
          setServices(response.data.services);
        }
      } catch (error) {
        // Nếu có lỗi, hiển thị lỗi ra console
        console.error(error);
      }
    };
    // Gọi hàm async
    fetchServices();
  }, []); // Chỉ gọi api một lần khi component được mount

  // Trả về jsx để hiển thị danh sách các dịch vụ
  return (
    <div style={{ backgroundColor: '#d4edda', minHeight: '100vh' }}>
      <Container style={{ marginTop: 20 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Danh sách các dịch vụ nha khoa</h1>
        <Grid columns={3}>
          {services.map((service) => (
            <Grid.Column key={service.MaDV}>
              <ServiceCard service={service} />
            </Grid.Column>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ServiceList;
