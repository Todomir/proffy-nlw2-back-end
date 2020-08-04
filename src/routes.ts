import express from 'express';
import db from './database/connection';
import { v4 as uuid } from 'uuid';
import convertHoursToMinutes from './utils/convertHoursToMinutes';
const routes = express.Router();

interface IScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

routes.post('/classes', async (request, response) => {
  const { name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;

  const trx = await db.transaction();

  try {
    const userData = await trx('users').insert({
      name,
      avatar,
      whatsapp,
      bio,
    });

    const user_id = userData[0];

    const classData = await trx('classes').insert({
      user_id,
      subject,
      cost,
    });

    const class_id = classData[0];

    const classSchedule = schedule.map((scheduleItem: IScheduleItem) => {
      return {
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHoursToMinutes(scheduleItem.from),
        to: convertHoursToMinutes(scheduleItem.to),
      };
    });

    await trx('class_schedule').insert(classSchedule);

    await trx.commit();

    return response.status(201).json({
      message: 'Everything worked great!',
    });
  } catch (error) {
    await trx.rollback();

    return response.status(400).json({
      error: 'Unexpected error while creating new class.',
    });
  }
});

export default routes;
