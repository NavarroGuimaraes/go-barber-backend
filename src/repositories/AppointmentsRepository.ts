import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

// DTO - Data Transfer Object
// Objeto usado para transferir objetos de um arquivo para o outro;
@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const foundAppointment = await this.findOne({
      where: { date },
    });

    return foundAppointment || null;
  }
}

export default AppointmentsRepository;
