import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/profileRelations'

const ProfileSidebar = function(propriedades) {
  return (
    <Box>
        <img className='userPhoto' src={`https://github.com/${propriedades.githubUser}.png`} alt="Sua foto de perfil" />
    </Box>
  )
}

export default function Home() {

  const githubUser = 'CrysLef'

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
            <h1>Bem-vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
        </div>

        <div className='profileRelationArea' style={{ gridArea: 'profileRelationArea'}}>
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'> 
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
               {pessoasFavoritas.map(itemAtual => {
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
