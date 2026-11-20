# Seguridad / Security

## Español

Si encuentra una vulnerabilidad, no abra un issue público. Escriba a [asteins@gmail.com](mailto:asteins@gmail.com) con los detalles y los pasos para reproducirla.

El afinador no tiene servidor, cuentas de usuario ni datos personales. El audio del micrófono se analiza en el dispositivo y nunca se graba ni se envía, y la app de Android no tiene permiso de acceso a internet. Lo único que se guarda son las preferencias de tema y La4, en el dispositivo de cada persona.

Para reducir el riesgo de dependencias comprometidas, pnpm rechaza versiones con menos de 3 días de publicadas y bloquea los scripts de instalación. Las GitHub Actions están fijadas por SHA de commit. Las claves de firma de Android nunca se suben al repositorio.

## English

If you find a vulnerability, please don't open a public issue. Write to [asteins@gmail.com](mailto:asteins@gmail.com) with the details and steps to reproduce it.

The tuner has no server, user accounts or personal data. Microphone audio is analyzed on the device and is never recorded or sent, and the Android app has no internet permission. The only things it stores are the theme and A4 preferences, on each person's device.

To reduce the risk of compromised dependencies, pnpm rejects versions published less than 3 days ago and blocks install scripts. GitHub Actions are pinned by commit SHA. Android signing keys never go into the repository.
