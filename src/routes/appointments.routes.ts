import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const appointmentRouter = Router();

appointmentRouter.use(ensureAuthentication);

appointmentRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  // o parseISO converte a data em um formato date nativo do javascript
  // o StartOfHour coloca tudo, além das horas, em 0. OU seja, coloca no começo daquela hora.
  // exemplo: 16:59:59 vai virar 16:00:00
  const convertedDate = parseISO(date);
  const createAppointmentService = new CreateAppointmentService();

  const appointment = await createAppointmentService.execute({
    provider_id,
    date: convertedDate,
  });

  return response.json(appointment);
});

appointmentRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

export default appointmentRouter;
