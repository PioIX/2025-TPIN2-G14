const useConnection = () => {
    const ip = "http://192.168.56.1"
    const port = 4000
    const url = ip + ":" + port
    return {url}
}

export {useConnection}