import React, {useState } from 'react'
import { ethers } from 'ethers';
// ABIs
import CentralABI from '../abis/Cental_ABI.json';

// Config
import config from '../config.json';

const DeployContract = ({account, central}) => {

    const [contractAddress, setContractAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateStatus, setUpdateStatus] = useState('');
    function showErrorMessage(error) {
        setLoading(false);
        alert(`An error occurred while connecting to MetaMask: ${error.message}`);
    }


    const fetchContractAddress = async () => {
        try {
            if (account) {
                const address = await central.getCompanySmartContractAddress(account);
                setContractAddress(address);
            } else {
                throw Error('Please check that you are connected to a wallet.');
            }
        } catch (error) {
            showErrorMessage(error);
        }
    };
    


    const createContract = async() =>{
        try{
                if (window.ethereum) {
                    // Request MetaMask access

                    console.log("metamask present")
            
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = await provider.getSigner();
                    // setProvider(provider);
                    const network = await provider.getNetwork();
                    if (network && network.chainId) {
                      console.log(network.chainId);
                    }
                    
                    console.log(signer)
                    const central = new ethers.Contract(config[network.chainId].central.address, CentralABI, signer);
                    
                    console.log(central)

                    // setCentral(central);
            
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await provider.listAccounts();
                    console.log(accounts)

                    // setAccount(accounts[0]);

                }
                setUpdateStatus("Validate the transaction through your wallet");
                let transaction = await central.createSmartContract();
                setLoading(true);
                await transaction.wait();
                await fetchContractAddress();
                setUpdateStatus("Contract created \n Address: ");
                setLoading(false);
        }catch(error){
            console.log("error here")
            setLoading(false);
            showErrorMessage(error);
        }
        
    }


    return (
        <div className='DeployContract'>
            <h3 className='Component__title'>Create My Contract</h3>
            <button className='button__toggle form__button' onClick={createContract}>Create Contract</button>
            {loading  ? (
                <div>Transaction in progress... It can take a few minutes </div>
                ) : ( 
                <p>{updateStatus}{contractAddress}</p>
            )}
        </div>
    )
}

export default DeployContract;