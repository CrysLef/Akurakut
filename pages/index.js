import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import jwt from 'jsonwebtoken'
import nookies from 'nookies'
import { 
  AlurakutMenu, 
  AlurakutProfileSidebarMenuDefault, 
  OrkutNostalgicIconSet 
} from '../src/lib/AlurakutCommons'

import { ProfileRelationsBoxWrapper } from '../src/components/profileRelations'

const ProfileSidebar = function(propriedades) {
  return (
    <Box as='aside'>
        <img 
          className='userPhoto' 
          src={`https://github.com/${propriedades.githubUser}.png`} 
          alt="Sua foto de perfil" 
        />

        <hr />

        <p>
          <a target="_blank" className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
            @{propriedades.githubUser}
          </a>
        </p>
        <hr />
        <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

const ProfileRelationsFollowers = function(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'> 
       {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
          {propriedades.items.slice(0,6).map(itemAtual => {
            return (
              <li key={itemAtual.id}>
                <a href={`https://github.com/${itemAtual.login}`}>
                  <img src={itemAtual.avatar_url} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            ) 
          })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {

  const githubUser = props.githubUser
  const [comunidades,setComunidades] = React.useState([])

  const [seguidores,setSeguidores] = React.useState([])

  React.useEffect(() => {
    
    // API Github
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(respostaDoServidor => respostaDoServidor.json())
    .then(respostaCompleta => setSeguidores(respostaCompleta))

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '400f2f0b3299966608f6eab42046fe',
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
      }`})
    })

    .then(response => response.json())
    .then(responseCompleta => {
      const comunidadesDoDato = responseCompleta.data.allCommunities
      setComunidades(comunidadesDoDato)
    })

  },[])

  const pessoasFavoritas = [
    'gabrielfroes',
    'filipedeschamps',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'diego3g',
  ]

  return (
    <>
      <AlurakutMenu />

      <MainGrid>

        <div className='profileArea' style={{ gridArea: 'profileArea'}}>
          <ProfileSidebar  githubUser={githubUser}/>
        </div>

        <div className='welcomeArea' style={{ gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="Title">Bem-vindo(a), {githubUser}</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCreateCommunity(e) {
              e.preventDefault()
              
              const dadosDoForm = new FormData(e.target)

              
              const comunidade = {
                creatorSlug: githubUser,
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image')
              }

              fetch('/api/comunidades',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async response => {
                const dados = await response.json()
                const comunidade = dados.registroCriado
                const comunidadesAtualizadas = [...comunidades, comunidade ]
                setComunidades(comunidadesAtualizadas)
              })
          
            }}>
              <div>
                <input 
                  className="titleInput"
                  type="text" 
                  name="title"
                  placeholder="Qual será o nome da sua comunidade?" 
                  aria-label="Qual será o nome da sua comunidade?" 
                  required
                />
              </div>
              <div>
                <input
                  className="urlInput" 
                  type="text" 
                  name="image"
                  placeholder="Insira a URL para usarmos de capa"
                  aria-label="Insira a URL para usarmos de capa" 
                  required
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className='profileRelationArea' style={{ gridArea: 'profileRelationArea'}}>
        <ProfileRelationsFollowers title="seguidores" items={seguidores} />
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.slice(0,6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'> 
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
               {pessoasFavoritas.slice(0,6).map(itemAtual => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                ) 
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx)
  const token = cookies.USER_TOKEN
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth',{
    headers: {
      Authorization: token
    }
  }) 
  .then(response => response.json())
  
  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  
  const { githubUser } = jwt.decode(token)
  return {
    props: {
      githubUser,
    },
  }
}

