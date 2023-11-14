import { Controller, ServiceUnavailableException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IZEmail, IZServer, ZEmailContactAddressBuilder } from '@zthun/helpful-internet';
import { SendMailOptions, createTransport } from 'nodemailer';

@Controller()
/**
 * Represents a service to send emails.
 */
export class ZNotificationsService {
  /**
   * Sends an email message.
   *
   * @param args The message to send with the server to send to.
   *
   * @returns A promise that, when resolved has sent the mail.  Returns a rejected promise if
   *          the send fails. Upon success, null is returned.
   */
  @MessagePattern({ cmd: 'sendEmail' })
  public async sendEmail({ msg, smtp }: { msg: IZEmail; smtp: IZServer }): Promise<null> {
    const auth =
      smtp.username || smtp.password
        ? {
            user: smtp.username,
            pass: smtp.password
          }
        : undefined;
    const port = smtp.port || 587;

    const transport = createTransport({
      host: smtp.address,
      port,
      auth
    });

    const from = new ZEmailContactAddressBuilder().address(msg.envelope.from).build();
    const to = new ZEmailContactAddressBuilder().addresses(msg.envelope.to || []).build();
    const cc = new ZEmailContactAddressBuilder().addresses(msg.envelope.cc || []).build();
    const bcc = new ZEmailContactAddressBuilder().addresses(msg.envelope.bcc || []).build();
    const subject = msg.subject;
    const html = msg.message;

    const mail: SendMailOptions = { from, to, cc, bcc, subject, html };

    try {
      await transport.sendMail(mail);
      return null;
    } catch {
      return Promise.reject(
        new ServiceUnavailableException(
          'The email server is currently not available.  You will need to try this again later.'
        )
      );
    }
  }
}
