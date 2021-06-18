import React, { useEffect, useRef, useState } from 'react';
import { createForm, formShape } from 'rc-form';
import { Checkbox, InputItem, Toast } from 'antd-mobile';
import { Button } from 'antd-mobile';
import styles from './index.less';
import classnames from 'classnames';
import Cookies from 'js-cookie';
import { EyeInvisibleOutlined, EyeOutlined, KeyOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { encodeText, decodeText } from '../../../public/crypto-js.js';

interface Props {
  form: typeof formShape;
}
const Login: React.FC<Props> = (props) => {
  const [passType, setPassType] = useState('password');
  const [errTip, setErrTip] = useState<string>();
  const [count, setCount] = useState<number>();
  const [rememberPsd, setRememberPsd] = useState(false);
  const { getFieldProps, getFieldError, validateFields, setFieldsValue } = props.form;
  const timeCount = useRef<NodeJS.Timeout | null>(null);
  const phoneRegex = /1{1}[0-9]{10}/;
  const startCount = () => {
    const account = props.form.getFieldValue('account');
    let _errTip = '';
    if (!account) {
      _errTip = '手机号不能为空';
      Toast.info(_errTip);
      setErrTip(_errTip);
      return;
    }
    if (!phoneRegex.test(account)) {
      _errTip = '手机号格式错误';
      Toast.info(_errTip);
      setErrTip(_errTip);
      return;
    }
    setErrTip('');
    let _count = 60;
    setCount(_count);
    timeCount.current = setInterval(() => {
      if (_count == 0 && timeCount.current) clearInterval(timeCount.current);
      if (_count > 0) {
        setCount(--_count);
      }
    }, 1000);
  };
  const onSubmit = () => {
    validateFields((err: any, values: any) => {
      if (err) {
        let _errTip = '';
        if (err['account']) {
          _errTip = getFieldError('account')[0];
          Toast.info(_errTip);
          setErrTip(_errTip);
          return;
        }
        if (err['password']) {
          _errTip = getFieldError('password')[0];
          Toast.info(_errTip);
          setErrTip(_errTip);
          return;
        }
        if (err['code']) {
          _errTip = getFieldError('code')[0];
          Toast.info(_errTip);
          setErrTip(_errTip);
          return;
        }
      }
      Toast.info('登录成功');
      const token = encodeText(JSON.stringify({ account: values.account, psd: values.password }));
      console.log(token);
      Cookies.set('token', token);
      if (rememberPsd) {
        Cookies.set('login', token);
      }
    });
  };
  useEffect(() => {
    let login = Cookies.get('login');
    if (login) {
      login = decodeText(login);
      login = JSON.parse(login);
      setFieldsValue({
        account: login.account,
        password: login.psd,
      });
    }
  }, []);
  return (
    <div className={styles.login_warpper}>
      <div className={styles.title}>Welcome</div>
      <div className={styles.form_wrapper}>
        <div className={styles.form_input}>
          <UserOutlined />
          <InputItem
            clear
            maxLength={11}
            pattern="[0-9]*"
            placeholder="手机号"
            autoComplete="new-password"
            className={styles.input}
            {...getFieldProps('account', {
              rules: [
                { required: true, message: '手机号不能为空' },
                {
                  validator(rules: any, val: string, clb: Function) {
                    if (!phoneRegex.test(val)) {
                      clb('手机号格式错误');
                    }
                    clb();
                  },
                },
              ],
            })}
          />
        </div>
        <div className={styles.form_input}>
          <KeyOutlined />
          <InputItem
            clear
            placeholder="密码"
            autoComplete="new-password"
            type={passType}
            className={styles.input}
            {...getFieldProps('password', {
              rules: [{ required: true, message: '密码不能为空' }],
            })}
          />
          {passType != 'password' ? (
            <EyeOutlined onClick={() => setPassType('password')} />
          ) : (
            <EyeInvisibleOutlined onClick={() => setPassType('text')} />
          )}
        </div>
        <div className={classnames(styles.form_input, styles.form_input_code)}>
          <MailOutlined />
          <InputItem
            clear
            placeholder="验证码"
            className={styles.input}
            {...getFieldProps('code', { rules: [{ required: true, message: '验证码不能为空' }] })}
          />
          {!count && <a onClick={startCount}>{count == 0 ? '重新发送验证码' : '发送验证码'}</a>}
          {count && <a>{count}s后重新发送</a>}
        </div>
        <Button type="primary" className={styles.btn} onClick={onSubmit}>
          登录
        </Button>
        <Button type="ghost" className={styles.btn}>
          注册
        </Button>
        <div>
          <span className="text-red">{errTip}</span>
          <span style={{ float: 'right' }} className={styles.tip}>
            <Checkbox className={styles.checkbox} checked={rememberPsd} onChange={(e) => setRememberPsd(e.target.checked)}>
              <span className={styles.label}>记住密码</span>
            </Checkbox>
            <a>忘记密码？</a>
          </span>
        </div>
      </div>
    </div>
  );
};
export default createForm()(Login);
