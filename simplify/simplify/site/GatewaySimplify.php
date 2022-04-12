<?php

class GatewayMyplugin extends PaymentGateway {

    /** @var boolean */
    protected $returnAfterCallback = false;

    public function init() {
		require_once(dirname(__FILE__)."/Simplify/Simplify.php");
	}

    /** @return string */
    public function getTransactionId() {}

    /**
     * @param array $formVars
     * @return string[]
     */
    public function createFormFields($formVars) {}

    /**
     * @param array $formVars
     * @return string
     */
    public function createRedirectUrl($formVars) {}

    /**
     * @param array $formVars
     * @return string
     */
    public function createInstantRedirectUrl($formVars) {}

    /**
     * @param StoreModuleOrder $order
     * @return boolean
     */
    public function callback(StoreModuleOrder $order = null) {
        return true;
    }

    /** @param StoreModuleOrder $order */
    public function verify(StoreModuleOrder $order = null) {}

}