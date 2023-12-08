import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useEffect,
  useState,
} from 'react'

import styles from '~/styles/inputQuantity.module.css'

import Minus from './icons/Minus'
import Plus from './icons/Plus'

interface Props {
  id?: string
  defaultValue?: number
  className?: string
  onChange?: (quantity: number) => void
}

export default forwardRef(function InputQuantity(
  props: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [quantity, setQuantity] = useState(1)
  const [isDirty, setIsDirty] = useState(false)

  const updateQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)

    // Constrol type validation
    if (e.target.value === '' || value < 0) {
      setQuantity(0)
    } else if (typeof value === 'number' && !Number.isNaN(value)) {
      setQuantity(value)
    }

    // Control value validation
    if (value > 100) {
      setQuantity(100)
    }

    setIsDirty(true)
  }

  const minusQuantity = () => {
    setQuantity(quantity - 1 >= 0 ? quantity - 1 : 0)
    setIsDirty(true)
  }

  const plusQuantity = () => {
    setQuantity(quantity + 1)
    setIsDirty(true)
  }

  useEffect(() => {
    if (props.defaultValue && !isDirty) {
      setQuantity(props.defaultValue)
      setIsDirty(true)
    }
  }, [props, isDirty])

  useEffect(() => {
    if (props.onChange) {
      props.onChange(quantity)
    }
  }, [quantity, props])

  return (
    <div className={`${styles.formControl} ${props.className}`}>
      <button
        type="button"
        className={`${styles.stepper} ${styles.minus}`}
        aria-label="reduce quantity"
        onClick={minusQuantity}
      >
        <Minus />
      </button>
      <input
        ref={ref}
        type="text"
        className={styles.input}
        value={quantity}
        onChange={updateQuantity}
      />
      <button
        type="button"
        className={`${styles.stepper} ${styles.plus}`}
        aria-label="increase quantity"
        onClick={plusQuantity}
      >
        <Plus />
      </button>
    </div>
  )
})
