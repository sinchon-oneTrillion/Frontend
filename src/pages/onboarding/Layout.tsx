import { Outlet } from 'react-router-dom';
import Container from './Container';

export default function OnboardingLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
