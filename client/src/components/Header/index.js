import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../pages/register/register.scss'

function Header() {
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleRegister = (e) => {}
  return (
    <div className='up'>
      <div className='top'>
        <div className='wrapper'>
          <img
            className='logo'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png'
            alt=''
          />
          <Link to='/login'>
            <button className='loginButton'>Sign In</button>
          </Link>
        </div>
      </div>
      <div className='container'>
        <div>
          <h1>
            Unlimited movies, TV
            <br /> shows,and more.
          </h1>
          <h3>Watch anywhere. Cancel anytime.</h3>
          <p>
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>
        </div>

        <div className='input'>
          <Link
            className='registerButton'
            onClick={handleRegister}
            to='/signUp'
          >
            Register
          </Link>
        </div>
        <div className='validation'>
          {isValid && <div>Email address is required</div>}
        </div>
      </div>
    </div>
  )
}

export default Header
