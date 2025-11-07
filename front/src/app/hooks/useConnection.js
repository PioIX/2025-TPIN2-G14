const useConnection = () => {
    const ip = "http://10.1.5.106"
    const port = 4000
    const url = ip + ":" + port
    return {url}
}

export {useConnection}