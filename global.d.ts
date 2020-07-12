declare module 'config' {
  interface Config {
    app: {
      logLevel: string,
      port: number,
    },
    storage: {
      mongo: {
        url: string,
        name: string,
        authDB?: string,
      },
    },
  }

  const config: Config
  export = config
}
