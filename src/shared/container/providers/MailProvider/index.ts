import { container } from 'tsyringe'
import mailConfig from '@config/mail'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import EtherealMailProvider from './implementatios/EtherealMailProvider'
import SESMailProvider from './implementatios/SESMailProvider'

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
}

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
  // precisou instanciar por causa do constructor
)
