import { injectable, inject } from 'tsyringe'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import { getDaysInMonth, getDate, isAfter } from 'date-fns'

type IResponse = Array<{
  day: number
  available: boolean
}>
interface IRequest {
  provider_id: string
  month: number
  year: number
}

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    )
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1,
    )
    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59)
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day
      })
      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      }
    })
    return availability
  }
}
export default ListProviderMonthAvailabilityService