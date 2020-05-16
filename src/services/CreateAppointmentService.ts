import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

/**
 * Vamos usar um dos principios do SOLID aqui.
 * O principio em questão se chamada dependecy inversion.
 * E porque vamos usá-lo?
 * Pois se não, teríamos que instanciar um novo relatório sempre que chamássemos o service
 * Para que isso não aconteça, vamos passar o repositório como parâmetro, assim ele fica declarado
 * somente na rota. Essa que por sua vez é chamada apenas uma vez na construção da aplicação;
 */

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const parsedDate = startOfHour(date);

    const existsAppointmentInSameDate = await appointmentsRepository.findByDate(
      parsedDate,
    );

    if (existsAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: parsedDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
