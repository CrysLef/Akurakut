import { SiteClient } from 'datocms-client'

export default async function recebeRequests(request, response) {
    if(request.method === 'POST') {
        const TOKEN = '662603be5da0f517c4e71caba50305'
        const client = new SiteClient(TOKEN)

        const registroCriado = await client.items.create({
            itemType: "975132",
            ...request.body
            // title: 'Futuro programador contratado',
            // imageUrl: 'https://github.com/CrysLef.png',
            // creatorSlug: 'CrysLef'
        })

        response.json({
            dados: 'Random Data',
            registroCriado: registroCriado
        })
        return
    }
    response.status(404).json({
        message: 'Nada aqui meu amigo,procura no POST!'
    })
}