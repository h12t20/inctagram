export const Notification = ({
  width = 24,
  height = 24,
  fill = 'white',
  ...props
}: {
  width?: number
  height?: number
  fill?: 'white' | 'black'
}) => {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5146 14L3.6946 12.818C4.0726 12.44 4.2806 11.938 4.2806 11.404V6.72699C4.2806 5.36999 4.8706 4.07299 5.9006 3.17099C6.9386 2.26099 8.2606 1.86099 9.6376 2.04199C11.9646 2.35099 13.7196 4.45499 13.7196 6.93699V11.404C13.7196 11.938 13.9276 12.44 14.3046 12.817L15.4856 14H2.5146ZM10.9996 16.341C10.9996 17.24 10.0836 18 8.9996 18C7.9156 18 6.9996 17.24 6.9996 16.341V16H10.9996V16.341ZM17.5206 13.208L15.7196 11.404V6.93699C15.7196 3.45599 13.2176 0.498986 9.8996 0.0599858C7.9776 -0.196014 6.0376 0.390986 4.5826 1.66699C3.1186 2.94899 2.2806 4.79299 2.2806 6.72699L2.2796 11.404L0.478603 13.208C0.00960291 13.678 -0.129397 14.377 0.124603 14.99C0.379603 15.604 0.972603 16 1.6366 16H4.9996V16.341C4.9996 18.359 6.7936 20 8.9996 20C11.2056 20 12.9996 18.359 12.9996 16.341V16H16.3626C17.0266 16 17.6186 15.604 17.8726 14.991C18.1276 14.377 17.9896 13.677 17.5206 13.208Z"
        fill={fill}
      />
    </svg>
  )
}
