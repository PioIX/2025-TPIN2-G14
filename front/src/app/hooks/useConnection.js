const useConnection = () => {
    const ip = "http://192.168.11.151"
    const port = 4000
    const url = ip + ":" + port
    return {url}
}

export {useConnection}