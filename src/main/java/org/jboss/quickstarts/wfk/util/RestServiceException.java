/**
 * jboss-wfk-quickstarts
 * <p/>
 * Copyright (c) 2015 Jonny Daenen, Hugo Firth & Bas Ketsman
 * Email: <me@hugofirth.com/>
 * <p/>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jboss.quickstarts.wfk.util;

import javax.ejb.ApplicationException;
import javax.ws.rs.core.Response;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>Custom Exception object to throw as an alternative to {@link javax.ws.rs.WebApplicationException} when creating a
 * RESTful API and returning JSON.</p>
 *
 * @author hugofirth
 * @see org.jboss.quickstarts.wfk.util.RestServiceExceptionHandler
 */
@ApplicationException(rollback = true)
public class RestServiceException extends RuntimeException implements
        Serializable {

    private static final long serialVersionUID = 1264443812161L;
    private static final String defaultMsg = "An unexpected error occurred whilst processing the request";

    private final Map<String, String> reasons;
    private final Response.Status status;

    public RestServiceException() {
        super(defaultMsg);
        this.reasons = new HashMap<>();
        this.status = Response.Status.INTERNAL_SERVER_ERROR;
    }

    public RestServiceException(String msg) {
        super(msg);
        this.reasons = new HashMap<>();
        this.status = Response.Status.INTERNAL_SERVER_ERROR;
    }

    public RestServiceException(String msg, Response.Status status) {
        super(msg);
        this.reasons = new HashMap<>();
        this.status = status;
    }

    public RestServiceException(String msg, Map<String, String> reasons, Response.Status status) {
        super(msg);
        this.reasons = reasons;
        this.status = status;
    }

    public RestServiceException(Exception e) {
        super(defaultMsg, e);
        this.reasons = new HashMap<>();
        this.status = Response.Status.INTERNAL_SERVER_ERROR;
    }

    public RestServiceException(String msg, Exception e) {
        super(msg, e);
        this.reasons = new HashMap<>();
        this.status = Response.Status.INTERNAL_SERVER_ERROR;
    }

    public RestServiceException(String msg, Response.Status status, Exception e) {
        super(msg, e);
        this.reasons = new HashMap<>();
        this.status = status;
    }

    public RestServiceException(String msg, Map<String, String> reasons, Response.Status status, Exception e) {
        super(msg, e);
        this.reasons = reasons;
        this.status = status;
    }

    public Map<String, String> getReasons() {
        return reasons;
    }

    public Response.Status getStatus() {
        return status;
    }
}